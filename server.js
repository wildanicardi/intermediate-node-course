const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port = 8000;
const app = express();

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`server is listening on port:${port}`)
})
const User = require('./models/User');
mongoose.connect('mongodb://localhost/userData')
// CREATE
app.post('/users', (req, res) => {
  // User.create()
})

app.route('/users/:id')
  // READ
  .get((req, res) => {
    // User.findById()
  })
  // UPDATE
  .put((req, res) => {
    // User.findByIdAndUpdate()
  })
  // DELETE
  .delete((req, res) => {
    // User.findByIdAndDelete()
  })