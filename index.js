var app = require('express')();
var http = require('http').createServer(app);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

http.listen(5000, () => {
  console.log('listening on *:5000');
});