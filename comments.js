// Create web server
// 1. Create a web server
// 2. Read the comments from file
// 3. Display the comments on the web server
// 4. Add a comment to the file
// 5. Display the comments on the web server

var http = require("http");
var fs = require("fs");
var url = require("url");
var querystring = require("querystring");

var comments = JSON.parse(fs.readFileSync("comments.json", "utf8"));

var server = http.createServer(function (req, res) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  if (url_parts.pathname === "/") {
    fs.readFile("comments.html", "utf8", function (err, data) {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("500 - Internal Server Error");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  } else if (url_parts.pathname === "/comments") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(JSON.stringify(comments));
  } else if (url_parts.pathname === "/add_comment") {
    var body = "";
    req.on("data", function (data) {
      body += data;
    });
    req.on("end", function () {
      var params = querystring.parse(body);
      comments.push(params.comment);
      fs.writeFile("comments.json", JSON.stringify(comments), function (err) {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("500 - Internal Server Error");
        } else {
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end("OK");
        }
      });
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 - Not Found");
  }
});

server.listen(8080);
console.log("Server running at http://localhost:8080/");
