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
        assert(false, err.message);
      }
    };

    router.on("/hello", (event, context, params) => {
      context.succeed("hello");
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
        throw new Error(message);
      },
      
      fail : function(err){
        return;
      }
    };

    router.on("/world", (event, context, params) => {
      context.fail("unexpected");
    });
    
    router(event, context);
  });

  it("uses path parameters", () => {
    const router = Router.createRouter();
    const event = {
      path : "/hello/taro"
    };
    
    const context = {
      succeed : function(message){
        assert(message === "hello taro");
      },
      
      fail : function(err){
        throw err;
      }
    };

    router.on("/hello/:name", (event, context, params) => {
      context.succeed(`hello ${params.name}`);
    });
    
    router(event, context);
  });
});
