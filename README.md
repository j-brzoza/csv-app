1. Starting application

npm install && node index.js

(recommended version of Node.js - 7.5.0)

2. Application runs http server with 2 endpoints

    To check if application's event loop is not blocked:
    - http://localhost:3000/ 

    To download output csv file:
    - http://localhost:3000/data/csv/:filename


    Put 'data.ndjson.gz' or 'data.ndjson' as ':filename'. File should be located in root directory of application;
    e.g. http://localhost:3000/data/csv/data.ndjson

    The stats will be shown on console after download.

    Output file's size is about 300MB.
    Csv file is compatible with LibreOffice.
    