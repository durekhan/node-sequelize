const db = global.db;
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

module.exports = (router) => {
  router.get("/", async (req, res) => {
    let pageNo=parseInt(req.query.page)-1;
    const {count,rows} = await db.Users.findAndCountAll({include: [
      {
        model: db.Posts,
      },
    ],offset:pageNo*parseInt(req.query.size),limit:parseInt(req.query.size)});
    if(count===0)
    {
      res.json({ msg: "invalid offset or limit" });
    }
    else
    {
      res.send({ posts: rows,
        page:req.query.page+"/"+Math.ceil((count) / parseInt(req.query.size))});
    }
  });
  router.delete("/", async (req, res) => {
    const users = await db.Users.destroy({
      where: {
        id: req.body.id,
      },
    });
    if (users === 1) {
      res.status(200).json({msg:"Deleted Successfully!"});
    } else {
      res.status(400).json({ msg: "Invalid Id" });
    }
  });
  router.put("/", async (req, res) => {
    req.body.password = db.Users.getHashedPassword(req.body.password);
    const users = await db.Users.update(req.body, {
      where: {
        id: req.body.id,
      },
    });
    if (users[0] === 1) {
      res.status(200).json({msg:"Updated Successfully!"});
    } else {
      res.status(400).json({ msg: "Invalid Id" });
    }
  });

  router.post("/login", async (req, res) => {
    const user = await db.Users.findOne({
      where: {
        email: req.body.email,
        password: db.Users.getHashedPassword(req.body.password),
      },
    });
    if (user) {
      res.json({ user: user, token: user.createAPIToken() });
    } else {
      res.status(400).json({ msg: "Invalid email or password" });
    }
  });

  router.get("/me", async (req, res) => {
    const user = await db.Users.findOne({
      where: {
        id: req.user.id,
      },
    });
    if (user) {
      res.json({ user: user, token: user.createAPIToken() });
    } else {
      res.status(400).json({ msg: "User not found" });
    }
  });

  router.post("/signup", async (req, res) => {
    const isAlreadyExist = await db.Users.count({
      where: { email: req.body.email },
    });
    if (isAlreadyExist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    req.body.password = db.Users.getHashedPassword(req.body.password);
    const user = await db.Users.create(req.body);

    res.json({ user: user, token: user.createAPIToken() });
  });
  router.use((req,res,next)=>{
    res.status(404);
    res.json({msg:"not found"});
    
  });
};
