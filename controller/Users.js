const User = require("../models/User");
// response function
const sendResponse = (res, err, data) => {
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
exports.index = async (req, res) => {
  await User.find({}, (err, data) => {
    sendResponse(res, err, data);
  });
}
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id, (err, data) => {
    sendResponse(res, err, data);
  });
}
exports.updateUser = async (req, res) => {
  await User.findByIdAndUpdate(
    req.params.id, {
      ...req.body.newData,
    }, {
      new: true,
    },
    (err, data) => {
      sendResponse(res, err, data);
    }
  );
};
exports.showUser = async (req, res) => {
  await User.findById(req.params.id, (err, data) => {
    sendResponse(res, err, data);
  });
}
exports.createUser = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.newData.password, 10);

  await User.create({
      ...req.body.newData,
      password: hashedPassword,
    },
    (err, data) => {
      sendResponse(res, err, data);
    }
  );
}