const mongoose = require('mongoose');

const configDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('Connected to database.');
    } catch (error) {
        console.log(`${error}`);
        process.exit(1);
    }
}

module.exports = configDB;

