# aws-lambda-event-router
URL-like inside routing for AWS lambda.

 ```js
const router = require("aws-lambda-event-router").createRouter();

router.on("/", (req, res) => {
  res.send("welcome");
});

router.on("/books/:id", (req, res) => {
  res.send("this is book " + req.params.id);
});

exports.handler = router;
 ```


## usage
Defining a router inside lambda execution.

 ```js
router.on("/", (req, res) => {
  res.send("welcome");
});
```

The `router` requires `path` parameter in an event object. `path` should be url-formed string.

```
{
  "path" : "/"
}
```

### params
`/:param_name` style parameter is supported. You can access a parameter by `req.params[param_name]`. For instance:

```js
router.on("/books/:id", (req, res) => {
  res.send("this is book " + req.params.id);
});
```

```
{
  "path" : "/books/1"
}
```

In this case, the response is `you selected book 1`.

### req/res
`req` includes `event`, `context` and `params`. `event` and `context` are basic arguments of lambda execution. `params` is the set of paramters.