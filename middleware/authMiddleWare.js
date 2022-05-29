const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const auth = async (req, res, next) => {
  try {
  if (req.header("Authorization")) {
    const token = req.header("Authorization").replace("Bearer ", "");
    const sonuc = jwt.verify(token, "secretkey");

    req.user = await User.findById({ _id: sonuc._id });
    next();

  }else{
      throw new Error("Lütfen giriş yapınız")
  }


  } catch (e) {
    next(e);
  }
};

module.exports = auth;
