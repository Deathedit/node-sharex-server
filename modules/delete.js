var logger = require('../logger.js');
const config = require('../config.json')
var fileExists = require('file-exists');
var fs = require('fs');

module.exports.load = (app) => {
    app.get('/delete', (req, res) => {
        if(!req.query.filename || !req.query.key) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).send(JSON.stringify({
                success: false,
                error: {
                    message: 'Key and/or file name is empty.',
                    fix: 'Submit a key and/or file name.'
                }
            }));
        } else {
            // Check if key is registered
            var key = req.query.key;
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
                // Generate file informations
                var fileName = req.query.filename;
                var filePath = './uploads/' + fileName;
                logger.info('Trying to delete ' + fileName + ' (' + shortKey + ')');
    
                // Check if file exists
                fileExists(filePath, function(err, exists) {
                    if(err) {
                        logger.error(err + ' (' + shortKey + ')');
                        return res.status(500).send(err);
                    }
    
                    if(!exists) {
                        // File doesnt exists
                        logger.info('File ' + fileName + ' doesnt exists, aborting... (' + shortKey + ')');
                        res.setHeader('Content-Type', 'application/json');
                        res.status(400).send(JSON.stringify({
                            success: false,
                            error: {
                                message: 'The file doesnt exists.',
                                fix: 'Submit a existing file name.'
                            }
                        }));
                    } else {
                        // File exists => Delete file
                        fs.unlink(filePath, function(err) {
                            if(err) {
                                logger.error(err + ' (' + shortKey + ')');
                                return res.status(500).send(err);
                            }
    
                            // Return the informations
                            logger.info('Deleted file ' + fileName + ' (' + shortKey + ')');
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify({
                                success: true,
                                message: "Deleted file " + fileName
                            }));
                        });
                    }
                });
            }
        }
    });
}