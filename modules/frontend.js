const version = require('../package.json').version;

module.exports.load = (app) => {
    app.get('/',(req,res) => {
        res.send('<title>node-sharex-server</title> This server runs <a href="https://github.com/Deathedit/node-sharex-server">node-sharex-server</a> v' + version + ' by <a href="https://moquo.de">Moquo</a>.')
    })
}