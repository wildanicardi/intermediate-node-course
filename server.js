const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const port = 8000;
const app = express();

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`server is listening on port:${port}`);
});
const User = require("./models/User");
mongoose.connect("mongodb://localhost/userData", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// response function
function sendResponse(res, err, data) {
  if (err) {
    res.json({
      success: false,
      message: err,
    });
  } else if (!data) {
    res.json({
      success: false,
      message: "Not Found",
    });
  } else {
    res.json({
      success: true,
      data: data,
    });
  }
}
// CREATE
app.post("/users", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.newData.password, 10);

  await User.create(
    {
      ...req.body.newData,
      password: hashedPassword,
    },
    (err, data) => {
      sendResponse(res, err, data);
    }
  );
});

app
  .route("/users/:id")
  // READ
  .get(async (req, res) => {
    await User.findById(req.params.id, (err, data) => {
      sendResponse(res, err, data);
    });
  })
  // UPDATE
  .put(async (req, res) => {
    await User.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body.newData,
      },
      {
        new: true,
      },
      (err, data) => {
        sendResponse(res, err, data);
      }
    );
  })
  // DELETE
  .delete(async (req, res) => {
    await User.findByIdAndDelete(req.params.id, (err, data) => {
      sendResponse(res, err, data);
    });
  });
