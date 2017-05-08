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
  try{
    let route;
    let params;
    
    if(this.cache[event.path]){
      route = this.cache[event.path].route;
      params = this.cache[event.path].params;
    }else{
      let i;
      for(i = 0; i<this.routes.length; i++){
        route = this.routes[i];
        params = route.filter(event.path);
        if(!!params){
          this.cache[event.path] = {
            route : route,
            params : params
          };
          break;
        };
      }
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
    return params;
  }.bind(null, pattern, paramList);

  return reqFilter;
}

exports.createRouter = createRouter;