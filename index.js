//Router class

function createRouter(){
  const rs = new RouterState();
  const r = router.bind(rs);
  r.on = on.bind(rs);
  return r;
}

function RouterState(){
  this.routes = [];
  this.cache = {};
}

/**
 * @param {object} event
 * @param {string} event.path url-like command
 * @param {object} context 
 */

function router(event, context){
  let route;
  let req, res = new Response(context);

  if(this.cache[event.path]){
    route = this.cache[event.path].route;
    req = this.cache[event.path].req;
  }else{
    let i;
    for(i = 0; i<this.routes.length; i++){
      route = this.routes[i];
      req = route.filter(event.path);
      if(!!req){
        this.cache[event.path] = {
          route : route,
          req : req
        };
        break;
      };
    }
  }  
  
  if(!!req){
    req.event = event;
    route.cb(req, res);
  }else{
    res.status(404).send("not found");  
  }
}

function on(path, cb){
  this.routes.push({
    filter : path2ReqFilter(path),
    cb : cb
  });
}

function path2ReqFilter(path){
  const parts = path.split("/").filter(p => p !== "");
  const paramList = [];
  let pattern = "^";
  let i, part, match;
  for(i = 0; i < parts.length; i++){
    part = parts[i];
    match = part.match(/^:(.+)$/);
    if(match){
      paramList.push(match[1]);
      pattern += "/(.+)";
    }else{
      pattern += `/${part}`;
    }
  }
  pattern += "$";
  
  const reqFilter = function(pattern, paramList, reqPath){
    const matched = reqPath.match(new RegExp(pattern));
    if(!matched) return;
    const params = {};
    let paramName, i;
    for(i = 0; i < paramList.length; i++){
      paramName = paramList[i];
      params[paramName] = matched[i+1];
    }
    return { params : params };
  }.bind(null, pattern, paramList);

  return reqFilter;
}

/**
 * @param {object} context  aws lambda context
 */
function Response(context){
  this.context = context;
  this.statusCode = 200;
}

Response.prototype.status = function(statusCode){
  this.statusCode = statusCode;
  return this;
}

Response.prototype.send = function(message){
  if(this.statusCode === 200){
    this.context.succeed(message);
  }else{
    this.context.fail(message);
  }
}

exports.createRouter = createRouter;