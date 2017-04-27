# lambda-event-router
URL-like routing for AWS lambda execution by event.

 ```js
const router = require("lambda-event-router").createRouter();

router.on("/", (req, res) => {
  res.send("welcome");
});

router.on("/books/:id", (req, res) => {
  res.send("you selected book " + req.params.id);
});

exports.handler = router;
 ```


## usage
The `router` requires `path` parameter in an event object. `path` should be url-formed string.

```
{
  path : "/"
}
```

Thus, you have to configure a trigger that kicks lambda execution (such as API Gateway) as passing the `path` parameter in an event object.