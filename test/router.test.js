const assert = require("power-assert");
const Router = require("../index");


describe("router", () => {
  it("creates new router", () => {
    const router = new Router();
    assert(router);
  });

  it("responds `hello`", () => {
    const router = new Router();
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
    router.resolve(event, context);
  });

  it("does not respond", () => {
    const router = new Router();
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
      res.send("unexpected");
    });
    
    router.resolve(event, context);
  });
});
