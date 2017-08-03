const fs = require('fs'),
    zlib = require('zlib'),
    Promise = require("bluebird"),
    fsStat = Promise.promisify(fs.stat);

class Data {

    getStream(fileName) {
        if (!fileName.endsWith('.gz')) {
            return Promise.resolve(fs.createReadStream(fileName));
        }
        return fsStat(fileName)
            .catch((err) => {
                return Promise.reject({statusCode: 404, message: `File ${fileName} not found`});
            })
            .then(() => this.extractGz(fileName));
    }

    extractGz(fileName) {
        let extractedFileName = fileName.slice(0, -3);
        return new Promise((resolve, reject) => {
            let stream = fs.createReadStream(fileName)
                .pipe(zlib.createGunzip())
                .pipe(fs.createWriteStream(extractedFileName));
            stream.on('finish', () => {
                resolve(fs.createReadStream(extractedFileName));
            });
            stream.on('error', (err) => {
                reject(err);
            });
        })
    }
}

module.exports = Data;