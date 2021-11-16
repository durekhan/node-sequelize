const db = global.db;
const { Sequelize } = require("sequelize");
const { route } = require("../../../..");
const Op = Sequelize.Op;

module.exports = (router) => {
  router.post("/", async (req, res) => {
    const category = await db.Categories.create(req.body);
    res.json({ category: category });
  });
  router.get("/",async (req,res)=>{
    const categories = await db.Categories.findAll(  
      {
      }); 
    res.json({ categories: categories });
  });
  router.put("/",async(req,res)=>{
    const categories = await db.Categories.update(req.body, {
      where: {
        id: req.body.id,
      },
    });
    if (categories[0] === 1) {
      res.status(200).json({msg:"updated successfully!"});
    } else {
      res.status(400).json({msg:"Invalid id"});
    }
  });
  router.delete("/",async(req,res)=>{
    console.log("IN CONTROLLER "+req.body.id);
    const categories = await db.Categories.destroy({
      where: {
        id: req.body.id,
      },
    });
    if (categories === 1) {
      res.status(200).json({msg:"Deleted Successfully!"});
    } else {
      res.status(400).json({ msg: "Invalid Id" });
    }
  });
  router.use((req,res,next)=>{
    res.status(404);
    res.json({msg:"not found"});
  });
};
