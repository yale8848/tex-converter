const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./lib/config');
const mathjax = require('./lib/mathjax');

const log = require('./lib/log');
const app = express();


app.use(cors());

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

log.init();

app.use('/tex', (req, res) => {

    let logData = { req: { format: req.query.format||req.body.format, tex: req.query.tex||req.body.tex, 
        display:req.query.display|| req.body.display, width: req.query.width||req.body.width } };

    mathjax.converter(logData.req).
    then(data => {
        logData.res = { ContentType: data.contentType, statusCode: 200 };
        res.setHeader("Content-Type", data.contentType);
        if (data.isPng) {
            res.write(data.data);
            res.end();
        } else {
            res.send(data.data);
        }
        log.writeJson(logData);
    }).catch(e => {
        logData.res = { statusCode: 500, msg: e };
        log.writeJson(logData);
        res.status(500).send(e);
    });
});

app.listen(config.port, () => log.write(`Web server listening on port ${config.port}!`));