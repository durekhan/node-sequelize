const db = global.db;
const { Sequelize } = require("sequelize");
const { route } = require("../../../..");
const Op = Sequelize.Op;

module.exports = (router) => {
  router.post("/", async (req, res) => {
    req.body.userId = req.user.id;
    const post = await db.Posts.create({
      title: req.body.title,
      body: req.body.body,
      userId:req.body.userId
    });

    req.body.categoryId.forEach(async x => {
      const postcategory = await db.Postcategories.create({
        postId: post.id,
        categoryId: x 
      });
    });
    //const post = await db.Posts.create(req.body);
    res.json({ post: post });
  });
  
  router.delete("/", async (req, res) => {
    const post = await db.Posts.destroy({
      where: {
        id: req.body.id,
        userId: req.body.userId,
      },
    });
    
    if (post===1) {
      res.status(200).json({msg:"deleted successfully!"});
    } else {
      res.status(400).json({msg:"Invalid id"});
    }
  });
  router.put("/", async (req, res) => {
    const posts = await db.Posts.update(req.body, {
      where: {
        id: req.body.id,
        userId: req.body.userId,
      },
    });
    if (posts[0] === 1) {
      res.status(200).json({msg:"updated successfully!"});
    } else {
      res.status(400).json({msg:"Invalid id"});
    }
    
  });
  router.get("/", async (req, res) => {
    let pageNo=parseInt(req.query.page)-1;
    const {count,rows} = await db.Posts.findAndCountAll(
      {
        offset:pageNo*parseInt(req.query.size),limit:parseInt(req.query.size)
      },
      {
        include: [
          {
            model: db.Users,
          },
        ],
      }
    );
    res.send({ posts: rows,
      page:req.query.page+"/"+Math.ceil((count) / parseInt(req.query.size))
    });
  });
  router.use((req,res,next)=>{
    res.status(404);
    res.json({msg:"not found"});
  });
};
