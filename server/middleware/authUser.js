const JWT = require("jsonwebtoken");

const authUserMiddleware = async (req, res, next) => {
  try {
    // console.log(req.headers.authorization)
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.SECRETE_KEY
    );
    req.user = decode;
    next();
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { authUserMiddleware };
