 const bcrypt = require('bcrypt')
async function run()
{
  const plainPassword = "mypassword123";

  const hashed = await bcrypt.hash(plainPassword, 10);
  console.log("original password", plainPassword);
  console.log("hashed version: ", hashed);

  const correctattempt = await bcrypt.compare("mypassword123", hashed);
  console.log("correct password matches", correctattempt);

  const wrongattempt = await bcrypt.compare("mypassword1235", hashed);
  console.log("wrong password match", wrongattempt);
}

run();