import "dotenv/config";
import express from 'express';
import user from './routes/user.routes'
import documentRoutes from './routes/document.routes'
import cors from 'cors';
import connectDB from './config/db';

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/users', user);
app.use('/api/documents', documentRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});