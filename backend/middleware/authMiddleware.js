const jwt = require("jsonwebtoken");
const User = require("../Models/userModel.js");
const asyncHandler = require("express-async-handler");

const protect = async (req, res, next) => {
  let token;

  // console.log('printing the token',req.headers.authorization)

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      return res.status(401).json('invalid token');
    //   throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
   return res.status(401).json('Please provide token');
    // throw new Error("Not authorized, no token");
  }
};

module.exports = { protect };