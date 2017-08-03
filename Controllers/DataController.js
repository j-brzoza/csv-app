const DataModel = require('../Models/Data'),
  CsvStream = require('../Lib/CsvStream');

const data = new DataModel();

const controller = {
  getCsv: function (req, res) {
    let fileName = req.params.name;
    if (!fileName) {
      res.json({ status: 400, msg: "Wrong parameters" })
    }

    data.getStream(fileName)
      .then((dataStream) => {
        res.attachment('output.csv');
        let stream = new CsvStream(dataStream);

        stream.setPipe(res);
        stream.append();

        req.on('close', stream.abort.bind(stream));

        stream.onError(function (err) {
          res.status(err.statusCode || 500).send({ error: err.message });
        });

        stream.onFinish(function (stats) {
          console.log(stats);
        })
      })
      .catch((err) => {
        let statusCode = err.statusCode || 500;
        res.json({ status: statusCode, msg: err.message })
      })
  }
};

module.exports = controller;