const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;

app.get('/api/register', (req, res) => {
	res.json({
		status: 'OK',
	});
});

app.listen(PORT, () => {
	console.log('Listening on PORT ', PORT);
});
