/* @author Moquo (Moritz Maier) */

const express = require('express');
const app = new express();

const config = require('./config.json');

var logger = require('./logger.js');
var fs = require('fs');

// Create /uploads directory if not exists
if(!fs.existsSync('./uploads/')) {
    fs.mkdirSync('./uploads/');
    logger.info('Created /uploads directory');
}

// Static directory for files
app.use('/f', express.static('./uploads'));
// body-parser middleware
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// express-fileupload middleware
var fileUpload = require('express-fileupload');
app.use(fileUpload({
    safeFileNames: true,
    preserveExtension: true,
    limits: {
        fileSize: config.fileSizeLimit
    }
}));

//Load Modules
const FLoader = require('./modules/frontend.js');
FLoader.load(app)
const ULoader = require('./modules/upload.js');
ULoader.load(app)
const DLoader = require('./modules/delete.js');
DLoader.load(app)


// Start web server
const PORT = 3854;
app.listen(PORT, function() {
    logger.success('Now listening on port ' + PORT);
});
