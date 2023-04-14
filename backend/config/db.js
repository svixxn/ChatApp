const mongoose = require("mongoose")

exports.connectDB = async (DB) =>{
    mongoose.connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log("DB connection established"));
}






