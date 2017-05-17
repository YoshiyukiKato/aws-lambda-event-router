//TODO: implement router.use method

function createRouter(){
  const rs = new RouterState();
  const r = router.bind(rs);
  r.get = on.bind(rs, "GET");
  r.post = on.bind(rs, "POST");
  r.put = on.bind(rs, "PUT");
  r.delete = on.bind(rs, "DELETE");
  r.head = on.bind(rs, "HEAD");
  r.patch = on.bind(rs, "PATCH");
  r.options = on.bind(rs, "OPTIONS");
  r.use = use.bind(rs);
  r.routes = rs.routes;
  return r;
}

function RouterState(){
  this.routes = {
    GET : {},
    POST : {},
    PUT : {},
    DELETE : {},
    HEAD : {},
    PATCH : {},
    OPTIONS : {}
  };

  this.cache = {
    GET : {},
    POST : {},
    PUT : {},
    DELETE : {},
    HEAD : {},
    PATCH : {},
    OPTIONS : {}
  };
}

/**
 * @param {object} event
 * @param {string} event.path url-like command
 * @param {object} context 
 */

function router(event, context){
  try{
    let resolved;
    if(this.routes[event.httpMethod]){
      if(this.cache[event.httpMethod][event.path]){
        resolved = this.cache[event.httpMethod][event.path];
      }else{
        const pathParts = event.path.split("/").filter(p => p !== "");
        resolved = resolve(pathParts, this.routes[event.httpMethod], {});
      }

      if(resolved){
        resolved.cb(event, context, resolved.params);
      }else{
        throw { statusCode : 404, message : "Not Found"};
      }
    }else{
      throw { statusCode : 405, message : "method not allowed" };
    }
  }catch(err){
    context.fail(err);
  }
}

function resolve(pathParts, route, params){
  if(pathParts.length === 0){
    return { 
      cb : route._,
      params : params
    }
  }

  let part = pathParts.splice(0, 1)[0];
  if(route[part]){
    return resolve(pathParts, route[part], params);
  }else if(route.__param__){
    params[route.__param__.name] = part;
    return resolve(pathParts, route.__param__.__, params);
  }else{
    return; //Not Found
  };
}

function use(path, router){
  let pathParts;
  Object.keys(router.routes).forEach((method) => {
    pathParts = path.split("/").filter(p => p !== "");
    this.routes[method] = _on(pathParts, this.routes[method], router.routes[method], true);
  });
}

function on(method, path, cb){
  const pathParts = path.split("/").filter(p => p !== "");
  this.routes[method] = _on(pathParts, this.routes[method], cb);
}

function _on(pathParts, route, cb, isCbRouter){
  if(pathParts.length === 0){
    if(isCbRouter) route = Object.assign(route, cb);
    else route._ = cb;
  }else{
    let part = pathParts.splice(0, 1)[0];
    let match = part.match(/^:(.+)$/);
    
    if (match) {
      let paramName = match[1];
      route.__param__ = {
        name : paramName,
        __ : _on(pathParts, {}, cb, isCbRouter)
      };
    }else{
      route[part] = _on(pathParts, (route[part] || {}), cb, isCbRouter)
    }
  }
  return route;
}

exports.createRouter = createRouter;