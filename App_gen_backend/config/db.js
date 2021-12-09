const mongoose = require("mongoose");

exports.connectDb = async () => {
    mongoose.connect(process.env.CONNECTION_STRING, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        .then(() => console.log('Connected Successfully'))
        .catch((err) => console.error('Not Connected'));

}