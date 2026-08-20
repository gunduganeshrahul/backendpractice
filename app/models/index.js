const Sequelize=require('sequelize');
const dbconfig=require('../config/db.config.js');


const sequelize=new Sequelize(
    dbconfig.DB,
    dbconfig.USER,
    dbconfig.PASSWORD,
    {
        host:dbconfig.HOST,
        port:dbconfig.port,
        dialect:dbconfig.dialect,
        pool:dbconfig.pool,
    }
);
const db={};
db.sequelize=sequelize;
db.teacher=require('./Teacher.model.js')(sequelize);// after route we have to add this line 
// after we have to move server.js file
db.studentinformation=require("./Student.model.js")(sequelize);
db.course=require("./Course.model.js")(sequelize);
db.library=require('./Library.js')(sequelize);
db.employee=require("./Employee.model.js")(sequelize);
db.product=require("../models/Product.model.js")(sequelize);
 db.vehicle=require("./Vehicle.model.js")(sequelize);
db.user=require('./User.modal.js')(sequelize);
db.reguser=require('./Studentreg.moedl.js')(sequelize);
db.customer=require('./CustomerAUTH.model.js')(sequelize);
db.invoice=require('./Invoice.model.js')(sequelize);
db.admin=require('../models/AdminRegister.model.js')(sequelize);
db.gym=require('../models/Gym.model.js')(sequelize);
db.trainer=require('../models/Trainer.model.js')(sequelize);
db.gym.belongsTo(db.trainer,{foreignKey:"TrainerID", as:"AssignedTrainer"});
db.trainer.hasMany(db.gym,{foreignKey:"TrainerID",as:"Members"})

db.loginreg=require('../models/loginregister.model.js')(sequelize);
db.vendor=require('../models/Vendor.model.js')(sequelize);

db.service=require('../models/Service.model.js')(sequelize);
db.staff=require('../models/Staff.model.js')(sequelize);

db.service.belongsTo(db.staff,{
    foreignKey:"StaffID",
    as:"AssignedStaff"
});
db.staff.hasMany(db.service,{
    foreignKey:"StaffID",
    as:"Services"
});

db.service.belongsTo(db.staff,{
    foreignKey:"StaffID",
    as:"AssignedStaff",
});

db.staff.hasMany(db.service,{
    foreignKey:"StaffID",
    as:"servies",
});
module.exports=db;
 