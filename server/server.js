const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// database
mongoose
	.connect(process.env.DATABASE_CLOUD, {})
	.then(() => console.log('DB connected'))
	.catch(err => console.log('DB Error => ', err));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const PORT = process.env.PORT || 5000;

// app middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(
	cors({
		origin: process.env.CLIENT_URL,
	})
);

//custom middlewares
app.use('/api', authRoutes);
app.use('/api', userRoutes);

app.listen(PORT, () => {
	console.log('Listening on PORT ', PORT);
});
