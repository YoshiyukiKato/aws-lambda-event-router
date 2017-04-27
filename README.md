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