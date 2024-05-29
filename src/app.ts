import express from 'express';
import cors from 'cors';
import router from './routes/routes';
import connectDb from './config/mongodb'
import multer from 'multer'

connectDb();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(multer)

// Routes
app.use(router);




// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
