module.exports.load = (app) => {
    const express = require('express');
    //variables
    var version = require('../package.json').version;

    /*
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.set('views', __dirname);

    app.get('/',(req,res) => {
        res.render('html/index.html', {version:version});
    });

    app.get('/images',(req,res) => {
        app.use('/uploads', express.static('./uploads'));
        res.render('html/images.html');
    });
    */
    app.use(express.static('./public'))

}