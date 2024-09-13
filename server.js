require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.AWS_REGION, // e.g., 'us-east-1'
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const PORT = process.env.PORT || 5001;
const connectDB = require('./config/dbConnection');
connectDB();

const credentials = require('./middleware/credentials');
app.use(credentials);

app.use(express.urlencoded({ extended: false }));

const corsOptions = require('./config/corsOptions');
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'mrovabizimages',
    contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically set the content type based on the file
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
});

// Upload endpoint
app.post('/upload', upload.single('businessImage'), (req, res) => {
  res.json({
    message: 'Success',
    imageUrl: req.file.location, // S3 URL of the uploaded image
  });
});

app.get('/', (req, res) => {
  res.status(200).send('Welcome to MrovaBizHub backend.');
});

app.use('/api/businesses', require('./routes/businessRoutes'));
app.use('/users', require('./routes/userRoutes'));

app.all('*', (req, res) => {
  res.status(404);
  res.json({ title: 'Not found', message: 'Route not found.' });
});

mongoose.connection.once('open', () => {
  console.log('Database connected');
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
});
