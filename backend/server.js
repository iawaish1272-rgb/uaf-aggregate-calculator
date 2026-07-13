const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const submissionRoutes = require('./routes/submissions');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());          // allows your Vercel-hosted frontend to call this backend
app.use(express.json());

app.use('/api', submissionRoutes);

app.get('/', (req, res) => {
  res.send('UAF Aggregate Calculator backend is running.');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
