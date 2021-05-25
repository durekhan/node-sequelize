const db = global.db;
const {Sequelize} = require('sequelize');
const Op = Sequelize.Op;

module.exports =  (router) => {

  router.post('/', async (req, res) => {
    req.body.userId = req.user.id;
    const post = await db.Posts.create(req.body);
    res.json({post: post});
  });

  router.get('/', async (req, res) => {
    const posts = await db.Posts.findAll({
      include: [{
        model: db.Users
      }]
    });
    res.json({posts: posts});
  });
};
