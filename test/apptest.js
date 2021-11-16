const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
var sleep = require("sleep-promise");
chai.should();
chai.use(chaiHttp);
const app = require("../app");
let expect = chai.expect;
describe("Category API", () => {
  beforeEach(async () => {
    await sleep(100);
  });
  describe("GET", () => {
    it("get categories", async () => {
      chai
        .request(server)
        .get("/api/v1/categories/")
        .end((error, response) => {
          console.log(response.body.categories);
          response.body.categories.should.be.a("array");
          
        });
     
    });
    it("wrong api", async () => {
      chai
        .request(server)
        .get("/api/v1/categories/category")
        .end((error, response) => {
          response.should.have.status(404);
          expect(response.body).to.deep.equal({ msg: "not found" });
         
        });
      
    });
  });

  //post api
  describe('POST CATEGORY',()=>{
      it('Post categories',async ()=>{
          const category={
              title:"top 10 salons",
              description:"salons",
          };
          chai.request(server).post("/api/v1/categories/").send(category).end((error,response)=>{
              console.log("BODY "+response.body.category);
                  response.body.category.should.be.a('object');
                  response.body.category.should.have.property("title").eq("top 10 salons");
                  response.body.category.should.have.property("description").eq("salons");
              });
          });
  });

  //put
  describe('UPDATE CATEGORY',()=>{
      it('update categories',async ()=>{
          const category={
              id:4,
              title:"fashion and beauty",
              description:"clothing and tips"
          };
          chai.request(server).put("/api/v1/categories/").send(category).end((error,response)=>{
              console.log("BODY "+response.body);
              response.should.have.status(200);
              expect(response.body).to.deep.equal({msg:"updated successfully!"});
              });
          });

      it('update categories with wrong id',async ()=>{
              const category={
                  id:100,
                  title:"fashion and beauty",
                  description:"clothing and tips"
              };
              chai.request(server).put("/api/v1/categories/").send(category).end((error,response)=>{
                  response.should.have.status(400);
                  expect(response.body).to.deep.equal({msg:"Invalid id"});
                  });

              });
  });

  //delete
  describe('DELETE CATEGORY',()=>{
      it('delete categories',async ()=>{
          const category={
              id:14
          };
          chai.request(server).delete("/api/v1/categories/").send(category).end((error,response)=>{
              response.should.have.status(200);
              expect(response.body).to.deep.equal({msg:"Deleted Successfully!"});
              });

          });
          it('delete categories with wrong id',async ()=>{
              const category={
                  id:100
              };
              chai.request(server).delete("/api/v1/categories/").send(category).end((error,response)=>{
                  //console.log("BODY "+response.body);
                  response.should.have.status(400);
                  expect(response.body).to.deep.equal({msg:"Invalid Id"});
                  });

              });
  });
});

describe("Users & Post Api", () => {
  let Token = "";
  beforeEach(async () => {
    await sleep(100);

    const user = {
      email: "isha@gmail.com",
      password: "hello",
    };
    chai
      .request(server)
      .post("/api/v1/users/login")
      .send(user)
      .end((error, response) => {
        Token = response.body["token"];
        console.log("BEFORE REQUEST TOKEN " + response.body["token"]);
      });
  });

      // //signup api
      describe('SIGNUP',()=>{
          it('user already exists',async ()=>{
              const user={
                  email:"alina@gmail.com",
                  password:"hello"
              };
              chai.request(server).post("/api/v1/users/signup").send(user).end((error,response)=>{
                      response.should.have.status(400);
                      expect(response.body).to.deep.equal({msg: "Email already exists" });
                  });
              });

          it('user signup',async ()=>{
              const user={
                      email:"alice@gmail.com",
                      password:"hello"
              };
              chai.request(server).post("/api/v1/users/signup").send(user).end((error,response)=>{
                  response.body.should.be.a('object');
                  response.body.should.have.property("user");
                  response.body.should.have.property("token");
                  });
          });

          it('wrong api',async ()=>{
              chai.request(server).get("/api/v1/users/user").set({ "Authorization": `Bearer ${Token}` }).end((error,response)=>{
                      response.should.have.status(404);
                      expect(response.body).to.deep.equal({msg:"not found"});
                  });
              });
      });

  //login api
  describe("LOGIN", () => {
    it("invalid email or password", async () => {
      const user = {
        email: "durek1@gmail.com",
        password: "hello12",
      };
      chai
        .request(server)
        .post("/api/v1/users/login")
        .send(user)
        .end((error, response) => {
          response.should.have.status(400);
          expect(response.body).to.deep.equal({
            msg: "Invalid email or password",
          });
        });
    });
    it("user login", async () => {
      const user = {
        email: "alina@gmail.com",
        password: "hello",
      };
      chai
        .request(server)
        .post("/api/v1/users/login")
        .send(user)
        .end((error, response) => {
          response.body.should.be.a("object");
          response.body.should.have.property("user");
          response.body.should.have.property("token");
        });
    });
  });

  //me
  describe("/me", () => {
    it("user me info", async () => {
      chai
        .request(server)
        .get("/api/v1/users/me")
        .set({ Authorization: `Bearer ${Token}` })
        .end((error, response) => {
          response.body.should.be.a("object");
          response.body.should.have.property("user");
          response.body.should.have.property("token");
        });
    });
  });

  //make a post

  describe("make a post", () => {
    it('post',async ()=>{
        const post1={
            title:"salons",
            body:"good salons",
            userId:9,
            categoryId:[4,6],
        };
        chai.request(server).post("/api/v1/posts/").set({ "Authorization": `Bearer ${Token}` }).send(post1).end((error,response)=>{
            console.log(response.body);
            response.body.post.should.be.a('object');
            });
    });
    it("wrong api", async () => {
      chai
        .request(server)
        .get("/api/v1/posts/user")
        .set({ Authorization: `Bearer ${Token}` })
        .end((error, response) => {
          response.should.have.status(404);
          expect(response.body).to.deep.equal({ msg: "not found" });
        });
    });
  });

  //get posts
  describe("get posts", () => {
    it("user posts ", async () => {
      chai
        .request(server)
        .get("/api/v1/posts/?page=1&size=2")
        .set({ Authorization: `Bearer ${Token}` })
        .end((error, response) => {
          response.body.should.be.a("object");
          response.body.should.have.property("posts");
          response.body.should.have.property("page");
        });
    });
  });

  //update a post
  describe("update  a post", () => {
    it('update post',async ()=>{
        const post1={
            id:4,
            userId:9,
            body:"top 10 beauty secrets with fashion  blogging",
        };
        chai.request(server).put("/api/v1/posts/").set({ "Authorization": `Bearer ${Token}` }).send(post1).end((error,response)=>{
           response.should.have.status(200);
           expect(response.body).to.deep.equal({  msg:"updated successfully!"});
            });
    });
    it("update wrong id post", async () => {
        const post1={
            id:121,
            userId:9,
            body:"top 10 beauty secrets with fashion  blogging",
        };
      chai
        .request(server)
        .put("/api/v1/posts/")
        .set({ Authorization: `Bearer ${Token}` }).send(post1)
        .end((error, response) => {
          response.should.have.status(400);
          expect(response.body).to.deep.equal({ msg:"Invalid id"});
        });
    });
  });

  //delete  a post
  describe("delete  a post", () => {
    it('delete',async ()=>{
        const post1={
            id:1,
            userId:1,
            
        };
        chai.request(server).delete("/api/v1/posts/").set({ "Authorization": `Bearer ${Token}` }).send(post1).end((error,response)=>{
           response.should.have.status(200);
           expect(response.body).to.deep.equal({  msg:"deleted successfully!"});
            });
    });
    it("delete wrong id post", async () => {
        const post1={
            id:120,
            userId:1,
            
        };
      chai
        .request(server)
        .delete("/api/v1/posts/").send([post1])
        .set({ Authorization: `Bearer ${Token}` })
        .send(post1)
        .end((error, response) => {
          response.should.have.status(400);
          expect(response.body).to.deep.equal({ msg:"Invalid id"});
        });
    });
  });

  //     //user posts
      describe('user posts',()=>{
          it('user posts ',async ()=>{

              chai.request(server).get("/api/v1/users/?page=1&size=2").set({ "Authorization": `Bearer ${Token}` }).end((error,response)=>{
                  response.body.should.be.a('object');
                  response.body.should.have.property("posts");
                  response.body.should.have.property("page");

                  });
          });
      });

      //put user
      describe('put user',()=>{
          const user={
              id:3,
              email:"aisha@gmail.com",
              password:"hello"
      };
          it('put user',async ()=>{

              chai.request(server).put("/api/v1/users/").set({ "Authorization": `Bearer ${Token}` }).send(user).end((error,response)=>{
                  response.should.have.status(200);
                  expect(response.body).to.deep.equal({ msg:"Updated Successfully!"});
                  });
          });

          const user1={
              id:200,
              email:"aisha@gmail.com",
              password:"helloworld"
      };
          it('put user with wrong id',async ()=>{

              chai.request(server).put("/api/v1/users/").set({ "Authorization": `Bearer ${Token}` }).send(user1).end((error,response)=>{
                  response.should.have.status(400);
                  expect(response.body).to.deep.equal({ msg: "Invalid Id"});
                  });
          });

      });

      //delete user
      describe('delete user',()=>{
          const body={id:13};
          it('delete user ',async ()=>{

              chai.request(server).delete("/api/v1/users/").set({ "Authorization": `Bearer ${Token}` }).send(body).end((error,response)=>{
                  response.should.have.status(200);
                  expect(response.body).to.deep.equal({ msg:"Deleted Successfully!"});
                  });
          });
          const user={id:200};
          it('delete user with wrong id',async ()=>{

              chai.request(server).delete("/api/v1/users/").set({ "Authorization": `Bearer ${Token}` }).send(user).end((error,response)=>{
                  response.should.have.status(400);
                  expect(response.body).to.deep.equal({ msg: "Invalid Id"});
                  });
          });
      });

      //auth header missing
      describe("/header missing", () => {
        it("user me info", async () => {
          chai
            .request(server)
            .get("/api/v1/users/me")
            .end((error, response) => {
              response.should.have.status(400);
              expect(response.body).to.deep.equal({ msg: 'Authorization header missing'});
            });
        });
        
        
      });

});
