const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('useCreateIndex', true);
mongoose.connect(
    process.env.MONGO_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true }
    ).then(() => {
    console.log("[MONGO] Connected!")
}).catch((err) => console.log(err.message));

mongoose.Promise = global.Promise;

module.exports = mongoose;
