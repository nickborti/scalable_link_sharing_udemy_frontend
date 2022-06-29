const express = require('express');
const app = express();

// Routes
const authRoutes = require('./routes/auth');

const PORT = process.env.PORT || 5000;

// middlewares
app.use('/api', authRoutes);

app.listen(PORT, () => {
	console.log('Listening on PORT ', PORT);
});
