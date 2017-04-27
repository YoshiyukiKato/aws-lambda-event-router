const assert = require("power-assert");
const Router = require("../index");


describe("router", () => {
  it("creates new router", () => {
    const router = Router.createRouter();

    assert(router);
  });

  it("responds `hello`", () => {
    const router = Router.createRouter();
    const event = {
      path : "/hello"
    };
    const context = {
      succeed : function(message){
        assert(message === "hello");
      },
      
      fail : function(err){
        assert(err);
      }
    };

    router.on("/hello", (req, res) => {
      res.send("hello");
    });
    router(event, context);
  });

  it("is not found", () => {
    const router = Router.createRouter();
    const event = {
      path : "/hello"
    };
    const context = {
      succeed : function(message){
        assert(new Error(message));
      },
      
      fail : function(err){
        assert(err);
      }
    };

    router.on("/world", (req, res) => {
      res.send("unexpecte");
    });
    
    router(event, context);
  });
});
