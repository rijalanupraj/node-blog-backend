// External Import
const passport = require('passport');

const auth = passport.authenticate('jwt', { session: false });

module.exports = auth;

/*

Manual Process

// Internal Import
const ExpressError = require('../helpers/expressError');
const { JWT } = require('../config/keys');

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new ExpressError('Authentication invalid', 401);
  }
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT.JWT_SECRET);
    // attach the user to the job routes
    req.user = { id: payload.id };
    next();
  } catch (error) {
    throw new ExpressError('Authentication invalid', 401);
  }
};
*/
