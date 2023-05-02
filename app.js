const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

app.use('/api', require('./routes/usuario'));

const dotenv = require("dotenv");
dotenv.config();

var mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
  })
  .then(() => console.log("connection successful"))
  .catch((err) => console.error(err));
var db = mongoose.connection;


app.listen(PORT, () => console.log('listening on port 5000'));