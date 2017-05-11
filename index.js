//TODO: implement router.use method

function createRouter(){
  const rs = new RouterState();
  const r = router.bind(rs);
  r.get = on.bind(rs, "GET");
  r.post = on.bind(rs, "POST");
  return r;
}

function RouterState(){
  this.routes = {
    GET : [],
    POST : []
  };

  this.cache = {
    GET : {},
    POST : {}
  };
}

/**
 * @param {object} event
 * @param {string} event.path url-like command
 * @param {object} context 
 */

function router(event, context){
  try{
    let route;
    let params;

    if(this.routes[event.httpMethod]){
      if(this.cache[event.httpMethod][event.path]){
        route = this.cache[event.httpMethod][event.path].route;
        params = this.cache[event.httpMethod][event.path].params;
      }else{
        let i;
        for(i = 0; i < this.routes[event.httpMethod].length; i++){
          route = this.routes[event.httpMethod][i];
          params = route.filter(event.path);
          if(!!params){
            this.cache[event.httpMethod][event.path] = {
              route : route,
              params : params
            };
            break;
          };
        }
      }
    }else{
      throw { statusCode : 405, message : "method not allowed" };
    }
    
    if(!!params){
      route.cb(event, context, params);
    }else{
      throw { statusCode : 404, message : "Not Found"};
    }
  }catch(err){
    context.fail(err);
  }
}

function on(method, path, cb){
  this.routes[method].push({
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
    return params;
  }.bind(null, pattern, paramList);

  return reqFilter;
}

exports.createRouter = createRouter;