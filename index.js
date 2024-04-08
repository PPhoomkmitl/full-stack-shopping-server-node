const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const invoiceRouter = require("./routes/invoiceRoute");
const userRouter = require("./routes/userRoute"); 
const productRouter = require("./routes/productRoute"); 
const categoryRouter = require("./routes/categoryRoute"); 

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route for user authentication
app.use("/invoice", invoiceRouter);
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/category", categoryRouter);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please choose another port.`);
  } else {
    console.error(`Unable to start the server: ${error.message}`);
  }
});
