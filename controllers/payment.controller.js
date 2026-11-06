const crypto = require("crypto");
const Razorpay = require("razorpay");
const db = require("../models");

const Payment = db.payment;
const Invoice = db.invoice;

function getRazorpayCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be configured");
  }

  return { keyId, keySecret };
}

function amountToPaise(amount) {
  const match = String(amount).match(/^(\d+)(?:\.(\d+))?$/);
  if (!match || (match[2] && /[^0]/.test(match[2].slice(2)))) {
    throw new Error("Invoice amount must be a valid INR amount");
  }

  const paise =
    Number(match[1]) * 100 +
    Number((match[2] || "").slice(0, 2).padEnd(2, "0"));
  if (!Number.isSafeInteger(paise) || paise <= 0) {
    throw new Error("Invoice amount must be a positive, valid INR amount");
  }

  return paise;
}

exports.createOrder = async (req, res) => {
  const body = req.body || {};
  const invoiceNumber =
    typeof body.InvoiceNumber === "string" ? body.InvoiceNumber.trim() : "";

  if (!invoiceNumber) {
    return res.status(400).json({
      success: false,
      message: "InvoiceNumber is required",
    });
  }

  let payment;

  try {
    const invoice = await Invoice.findOne({
      where: { InvoiceNumber: invoiceNumber, IsActive: true },
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Active invoice not found",
      });
    }

    if (String(invoice.Status).toLowerCase() === "paid") {
      return res.status(409).json({
        success: false,
        message: "Invoice has already been paid",
      });
    }

    const amount = amountToPaise(invoice.Amount);
    const { keyId, keySecret } = getRazorpayCredentials();
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    payment = await Payment.create({
      OrderID: invoice.InvoiceNumber,
      Amount: invoice.Amount,
      Currency: "INR",
      Status: "CREATED",
    });

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `payment-${payment.PaymentID}`,
    });

    await payment.update({ RazorpayOrderID: order.id });

    return res.status(201).json({
      success: true,
      message: "Razorpay order created",
      keyId,
      order,
      paymentId: payment.PaymentID,
    });
  } catch (error) {
    if (payment && !payment.RazorpayOrderID) {
      try {
        await payment.update({ Status: "FAILED" });
      } catch (updateError) {
        console.error("Failed to mark Razorpay payment order as failed:", updateError);
      }
    }

    console.error("Razorpay order creation failed:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create Razorpay order",
    });
  }
};

exports.verifyPayment = async (req, res) => {
  const body = req.body || {};
  const {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
  } = body;

  if (
    typeof orderId !== "string" ||
    typeof paymentId !== "string" ||
    typeof signature !== "string" ||
    !orderId ||
    !paymentId ||
    !/^[a-f\d]{64}$/i.test(signature)
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid Razorpay order, payment, and signature values are required",
    });
  }

  try {
    const payment = await Payment.findOne({
      where: { RazorpayOrderID: orderId },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment order not found",
      });
    }

    const { keyId, keySecret } = getRazorpayCredentials();
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest();
    const receivedSignature = Buffer.from(signature, "hex");

    if (!crypto.timingSafeEqual(expectedSignature, receivedSignature)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const providerPayment = await razorpay.payments.fetch(paymentId);

    if (
      providerPayment.order_id !== orderId ||
      providerPayment.amount !== amountToPaise(payment.Amount) ||
      providerPayment.currency !== payment.Currency
    ) {
      return res.status(400).json({
        success: false,
        message: "Razorpay payment does not match this invoice",
      });
    }

    if (providerPayment.status !== "captured") {
      return res.status(409).json({
        success: false,
        message: "Razorpay payment has not been captured",
      });
    }

    const result = await db.sequelize.transaction(async (transaction) => {
      const lockedPayment = await Payment.findByPk(payment.PaymentID, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!lockedPayment) {
        return "conflict";
      }

      if (lockedPayment.Status === "PAID") {
        return lockedPayment.RazorpayPaymentID === paymentId ? "already-paid" : "conflict";
      }

      if (lockedPayment.Status !== "CREATED") {
        return "conflict";
      }

      const invoice = await Invoice.findOne({
        where: { InvoiceNumber: lockedPayment.OrderID },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!invoice || String(invoice.Status).toLowerCase() === "paid") {
        return "conflict";
      }

      await lockedPayment.update(
        {
          RazorpayPaymentID: paymentId,
          Signature: signature,
          Status: "PAID",
        },
        { transaction },
      );
      await invoice.update({ Status: "paid" }, { transaction });

      return "paid";
    });

    if (result === "conflict") {
      return res.status(409).json({
        success: false,
        message: "Payment or invoice is no longer payable",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        result === "already-paid"
          ? "Payment was already verified"
          : "Payment verified successfully",
    });
  } catch (error) {
    console.error("Razorpay payment verification failed:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to verify payment",
    });
  }
};