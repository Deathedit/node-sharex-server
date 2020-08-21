var logger = require('../logger.js');
const config = require('../config.json')
var randomString = require('random-string');
var path = require('path');

module.exports.load = (app) => {
    app.post('/upload', (req, res) => {
        // Check if key is set
        if(!req.body.key) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send(JSON.stringify({
                success: false,
                error: {
                    message: 'Key is empty.',
                    fix: 'Submit a key.'
                }
            }));
        } else {
            // Check if key is registered
            var key = req.body.key;
            var shortKey = key.substr(0, 3) + '...';
            if(config.keys.indexOf(key) == -1) {
                logger.auth('Failed authentication with key ' + key);
                res.setHeader('Content-Type', 'application/json');
                res.status(401).send(JSON.stringify({
                    success: false,
                    error: {
                        message: 'Key is invalid.',
                        fix: 'Submit a valid key.'
                    }
                }));
            } else {
                // Key is valid
                logger.auth('Authentication with key ' + shortKey + ' succeeded');
                // Check if file was uploaded
                if(!req.files.file) {
                    logger.info('No file was sent, aborting... (' + shortKey + ')');
                    res.setHeader('Content-Type', 'application/json');
                    res.status(400).send(JSON.stringify({
                        success: false,
                        error: {
                            message: 'No file was uploaded.',
                            fix: 'Upload a file.'
                        }
                    }));
                } else {
                    // File was uploaded
                    var file = req.files.file;
                    // Generate the path
                    var fileExtension = path.extname(file.name);
                    var newFileName = randomString({length: config.fileNameLength}) + fileExtension;
                    var uploadPath = './uploads/' + newFileName;
                    logger.info('Uploading file ' + file.name + ' to ' + newFileName + ' (' + shortKey + ')');
    
                    // Check file extension (if enabled)
                    if(config.fileExtensionCheck.enabled && config.fileExtensionCheck.extensionsAllowed.indexOf(fileExtension) == -1) {
                        // Invalid file extension
                        logger.info('File ' + file.name + ' has an invalid extension, aborting... (' + shortKey + ')');
                        res.setHeader('Content-Type', 'application/json');
                        res.status(400).send(JSON.stringify({
                            success: false,
                            error: {
                                message: 'Invalid file extension.',
                                fix: 'Upload a file with a valid extension.'
                            }
                        }));
                    } else {
                        // Move files
                        file.mv(uploadPath, function(err) {
                            if(err) {
                                logger.error(err + ' (' + shortKey + ')');
                                return res.status(500).send(err);
                            }
    
                            // Return the informations
                            logger.info('Uploaded file ' + file.name + ' to ' + newFileName + ' (' + shortKey + ')');
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify({
                                success: true,
                                file: {
                                    url: config.serverUrl + '/f/' + newFileName,
                                    delete_url: config.serverUrl + '/delete?filename=' + newFileName + '&key=' + key
                                }
                            }));
                        });
                    }
                }
            }
        }
    });
}