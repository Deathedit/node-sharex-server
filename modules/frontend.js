/* https://bootswatch.com/cyborg/ */

module.exports.load = (app) => {
    const express = require('express');
    const config = require('../config.json')

    app.engine('html', require('ejs').renderFile);
    app.use('/uploads', express.static('./uploads'));

    app.get('/',(req,res) => {
        res.render('../public/index.html', {version:require('../package.json').version});
    });

    app.get('/images',(req,res) => {
        res.render('../public/images.html');
    });
    app.get('/settings',(req,res) => {
        res.render('../public/settings.html');
    })
    app.get('/view/:id',(req,res) => {
        res.render('../public/view.html', {id:req.params.id, key:config.keys});
    })

}