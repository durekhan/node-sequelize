const jwt = require('jsonwebtoken');
const promise = require('bluebird');
const jwtVerify = promise.promisify(require('jsonwebtoken').verify);
const db = global.db;
module.exports = () => {
  return async (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(400).send({msg: 'Authorization header missing'});
    } else {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = await jwtVerify(token, req.app.kraken.get('app:jwtSecret'));
        if (!decoded) {
          return res.status(401).send({msg: 'Invalid Token'});
        }
        const user = await db.Users.findOne({where: {id: decoded.id}});
        if (!user) {
          return res.status(404).send({msg: 'User not found'});
        }
        req.user = user;
        next();
      } catch (error) {
        global.log.error(error);
        res.status(401).send({msg: 'Invalid Token'});
      }
    }
  };
};
