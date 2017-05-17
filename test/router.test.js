const assert = require("power-assert");
const Router = require("../index");


describe("router", () => {
  it("creates new router", () => {
    const router = Router.createRouter();
    assert(router);
  });

  describe("http methods", () => {
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

    it("responds `hello` to a PUT request", () => {
      const router = Router.createRouter();
      const event = {
        httpMethod : "PUT",
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

      router.put("/hello", (event, context, params) => {
        context.succeed("hello");
      });
    
      router(event, context);
    });

    it("responds `hello` to a DELETE request", () => {
      const router = Router.createRouter();
      const event = {
        httpMethod : "DELETE",
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

      router.delete("/hello", (event, context, params) => {
        context.succeed("hello");
      });
    
      router(event, context);
    });

    it("responds `hello` to a HEAD request", () => {
      const router = Router.createRouter();
      const event = {
        httpMethod : "HEAD",
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

      router.head("/hello", (event, context, params) => {
        context.succeed("hello");
      });
    
      router(event, context);
    });

    it("responds `hello` to a PATCH request", () => {
      const router = Router.createRouter();
      const event = {
        httpMethod : "PATCH",
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

      router.patch("/hello", (event, context, params) => {
        context.succeed("hello");
      });
    
      router(event, context);
    });

    it("responds `hello` to a OPTIONS request", () => {
      const router = Router.createRouter();
      const event = {
        httpMethod : "OPTIONS",
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

      router.options("/hello", (event, context, params) => {
        context.succeed("hello");
      });
    
      router(event, context);
    });
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
  
  describe("path parameter", () => {
    it("uses path parameter", () => {
      const router = Router.createRouter();
      const event = {
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
      
      router(event, context);
    });

    it("uses multiple path parameters", () => {
      const router = Router.createRouter();
      const event = {
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

      router.get("/:greet/:name", (event, context, params) => {
        context.succeed(`${params.greet} ${params.name}`);
      });
      
      router(event, context);
    });
  });

  it("imports a sub router", () => {
    const router = Router.createRouter();
    const subRouter = Router.createRouter();
    
    const event = {
      httpMethod : "GET",
      path : "/sub/hello"
    };

    const context = {
      succeed : function(message){
        assert(message === "hello");
      },
      
      fail : function(err){
        throw err;
      }
    };

    subRouter.get("/hello", (event, context, params) => {
      context.succeed("hello");
    });
    
    router.use("/sub", subRouter);
    router(event, context);
  });

});
