const express = require('express');
const cors = require('cors');

const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();

app.use(cors())
app.use(bodyParser.json())

app.use(logger('dev'));

const PORT = process.env.PORT || 3000

app.get('/', async (req, res) => {
  try {
    res.send({message : "this is a message" })
  } catch (e) {
    res.status(e.status).json({ msg: e.status })
  }
});


app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
