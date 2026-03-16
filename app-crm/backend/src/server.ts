import "dotenv/config";
import express from 'express';
import user from './routes/user.routes'
import cors from 'cors';
import connectDB from './config/db';

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/users', user);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});