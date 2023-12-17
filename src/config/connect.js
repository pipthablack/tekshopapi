import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


 const config = {};

mongoose.set('strictQuery', false);
config.connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.dbUrl,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`\x1b[36m%s\x1b[0m`, `DB: MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`\x1b[31m%s\x1b[0m`, `DB: MongoDB Conn Failure: ${error.message}`);
        process.exit(1);
    }
}

export default config;