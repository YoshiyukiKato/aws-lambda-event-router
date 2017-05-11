const assert = require("power-assert");
const Router = require("../index");


describe("router", () => {
  it("creates new router", () => {
    const router = Router.createRouter();

    assert(router);
  });

  it("responds `hello` to a GET request", () => {
    const router = Router.createRouter();
    const event = {
      httpMethod : "GET",
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

    router.get("/hello", (event, context, params) => {
      context.succeed("hello");
    });
  
    router(event, context);
  });

  it("responds `hello` to a POST request", () => {
    const router = Router.createRouter();
    const event = {
      httpMethod : "POST",
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

    router.post("/hello", (event, context, params) => {
      context.succeed("hello");
    });
    
    router(event, context);
  });

  it("is not found", () => {
    const router = Router.createRouter();
    const eventGET = {
      httpMethod : "GET",
      path : "/hello"
    };
    const eventPOST = {
      httpMethod : "POST",
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

    router.get("/world", (event, context, params) => {
      context.fail("unexpected");
    });
    router.post("/world", (event, context, params) => {
      context.fail("unexpected");
    });
    
    router(eventGET, context);
    router(eventPOST, context);
  });

  it("uses path parameters", () => {
    const router = Router.createRouter();
    const eventGET = {
      httpMethod : "GET",
      path : "/hello/taro"
    };
    const eventPOST = {
      httpMethod : "GET",
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

    router.get("/hello/:name", (event, context, params) => {
      context.succeed(`hello ${params.name}`);
    });
    router.post("/hello/:name", (event, context, params) => {
      context.succeed(`hello ${params.name}`);
    });

    router(eventGET, context);
    router(eventPOST, context);
  });
});
