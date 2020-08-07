const encrypt = require('../services/encryption');
const dbConnection = require('../services/database');

async function checkCustomerAuth(req, res, next) {

  const token = req.headers.authorization;

  if (token) {
    try {
      const { sub } = encrypt.decode(token);
      const user = await dbConnection.getUserById(sub);

      if (user && user._id) {
        req.user = user;
        next();
        return;
      }
    } catch (err) {
      req.user = null;
    }
  }

  res.status(403).send({ error: 'unauthorized' });
}

module.exports = checkCustomerAuth;