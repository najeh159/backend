// server.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const productRoutes = require('./routes');  // Make sure path is correct
const port = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Use the product routes
app.use('/api', productRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
