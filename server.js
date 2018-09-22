const express = require('express');

const app = express('express');

app.use(express.static('dist'));

module.exports = app.listen(
  process.env.NODE_ENV || 8080,
  () => console.log('server is started!')
);
