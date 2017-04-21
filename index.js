const Promise = require("bluebird");

//Router class
function Router(){
  this.cache = {};
  this.routes = [];
}

Router.prototype.on = function(path, cb){
  this.routes.push({
    genReq : getReqGenerator(path),
    cb : cb
  });
}

Router.prototype.resolve = function(event, context){
  let route, req, res;
  if(this.cache[event.path]){
    route = this.cache[event.path].route;
    req = this.cache[event.path].req;
  }else{
    let i;
    for(i = 0; i<this.routes.length; i++){
      route = this.routes[i];
      req = route.genReq(event.path);
      if(!!req){
        this.cache[event.path] = {
          route : route,
          req : req
        };
        break;
      };
    }
  }  
  
  //TODO: ここでのエラーを回収きるようにする
  if(!req){
    return;    
  }

  req.event = event;
  res = {
    send : context.succeed,
    error : context.fail
  }
  route.cb(req, res);
}

function getReqGenerator(path){
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

  const reqGenerator = function(pattern, paramList, reqPath){
    const regexp = new RegExp(pattern);
    const match = reqPath.match(regexp);
    if(!match)return;
    
    const params = {};
    let paramName, i;
    for(i = 0; i < paramList.length; i++){
      paramName = paramList[i];
      params[paramName] = match[i+1];
    }
    return { params : params };
  }.bind(null, pattern, paramList)
  
  return reqGenerator;
}


module.exports = Router