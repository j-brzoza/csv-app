const readline = require('readline'),
  Stream = require('stream'),
  CsvWriter = require('csv-write-stream'),
  CsvParser = require('./CsvParser');

class CsvStream {

  constructor(dataStream) {
    this.rl = readline.createInterface(dataStream, new Stream)
    this.csvWriter = new CsvWriter();
    this.csvParser = new CsvParser();
  }

  setPipe(writeStream) {
    this.csvWriter.pipe(writeStream)
  }

  append() {
    this.rl.on('line', (line) => {
      let csvRow = this.csvParser.fromStringLine(line);
      if (csvRow) {
        this.csvWriter.write(csvRow);
      }
    });

    this.rl.on('close', () => {
      this.csvWriter.end();

      if (this.finishCallback) {
        let stats = {
          avgFriends: this.csvParser.getAverageNumberOfFriends()
        };
        this.finishCallback(stats);
      }
    });

    this.rl.on('error', (err) => {
      if (this.errorCallback) {
        this.errorCallback.call(err);
      }
    })
  }

  onError(cb) {
    this.errorCallback = cb;
  }

  onFinish(cb) {
    this.finishCallback = cb;
  }

  abort() {
    this.csvWriter.end();
    this.rl.close();
  }
}

module.exports = CsvStream;