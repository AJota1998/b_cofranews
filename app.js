const express = require('express');
const app = express();
const PORT = 5000;
const cors = require('cors');
const bodyParser = require('body-parser');


app.use(express.json());
/*app.use(cors(

));*/

app.configure(function() {
  app.use(cors({ origin: "https://ajota1998.github.io/f_cofranews/", credentials: true }));
});
 


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})*/

app.use('/', require('./routes/usuario'));
app.use('/', require('./routes/colectivo'));
app.use('/', require('./routes/espacio'));
app.use('/', require('./routes/publicacion'));

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