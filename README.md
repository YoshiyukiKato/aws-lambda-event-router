# aws-lambda-event-router
URL-like inside routing for AWS lambda.

 ```js
const router = require("aws-lambda-event-router").createRouter();

router.on("/", (event, context, params) => {
  context.succeed("welcome");
});

router.on("/books/:id", (event, context, params) => {
  context.succeed("this is book " + params.id);
});

exports.handler = router;
 ```


## usage
Defining a router in lambda execution.

 ```js
router.on("/", (event, context, params) => {
  context.succeed("welcome");
});
```

The `router` requires `path` parameter in an event object. `path` should be url-formed string. A minimum event object is:

```
{
  "path" : "/"
}
```

Then a response will be `welcome`.

### params
`/path/:param_name` style parameter is supported. You can access a parameter by `req.params[param_name]`. For instance:

```js
router.on("/books/:id", (event, context, params) => {
  context.succeed("this is book " + params.id);
});
```

```
{
  "path" : "/books/1"
}
```

In this case, the response is `this is book 1`.