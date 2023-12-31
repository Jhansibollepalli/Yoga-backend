const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const allowedOrigin = 'https://yoga-frontend-6nod.onrender.com';


const app = express();
app.use(cors({
  origin: allowedOrigin,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials (e.g., cookies, authorization headers)
}));
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb+srv://jhansibollepalli18:jhansi1807@yogacluster.9cmsrpw.mongodb.net/Yoga");

const customerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true,},
  age: { type: Number, required: true },
  batch: { type: String, required: true },
  amountPaid: { type: Number, default: 0 },
});

const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

app.post('/api/submitForm', async (req, res) => {
  try {
    if (!req.body.email || !req.body.username || !req.body.age || !req.body.batch) {
      return res.status(400).json({ error: 'Incomplete data. Please fill in all details' });
    }

    if (req.body.age < 18 || req.body.age > 65) {
        return res.status(400).json({ error: 'Age must be in the range 18-65' });
    }

    const newCustomer = new Customer({
      email: req.body.email,
      username: req.body.username,
      age: req.body.age,
      batch: req.body.batch,
    });

    await newCustomer.save();

    res.status(200).json({ success: true, message: 'Form Submitted Successfully' });

  } catch (error) {
    console.error('Error Submitting Form:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/updateDatabase', async (req, res) => {
  try {
    const { email, amount } = req.body;

    const updatedCustomer = await Customer.updateOne(
      { email },
      { $inc: { amountPaid: amount } }
    );

    if (updatedCustomer.nModified > 0) {
      res.status(200).json({ success: true, message: 'Database Updated Successfully' });
    } else {
      res.status(404).json({ error: 'Customer not found or database not updated' });
    }
  } catch (error) {
    console.error('Error Updating Database:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Enable CORS for the specified origin
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
