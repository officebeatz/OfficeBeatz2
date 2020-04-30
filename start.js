const app = require('./app');

const port = process.env.PORT || 3752;

app.listen(port, function () {
  console.log('app running on port: ' + port);
});
