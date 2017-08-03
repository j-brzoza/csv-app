const express = require('express'),
    PORT = 3000;
const dataController = require('./Controllers/DataController');

const app = express();

app.get('/data/csv/:name', dataController.getCsv);

app.get('/', (req, res) => {
  res.end('I am still alive');
});

app.listen(3000, () => console.log(`Application is listening on http://localhost:${PORT}`));