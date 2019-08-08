const rfs = require("rotating-file-stream");
const moment = require("moment");
const fs = require("fs");
const config = require('./config');
let stream = {};

const dir = '/logs';
module.exports = {

    init: function() {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
       
        stream = rfs(`${dir}/file.log`, {
            size: config.logSize,
            maxFiles: config.logMaxFiles
        });
    },
    writeJson: function(o) {
        this.write(JSON.stringify(o));
    },
    write: function(o) {
        const msg = moment().format('YYYY-MM-DD HH:mm:ss') + "# " + o + "\r\n";
        stream.write(msg);
        console.log(msg);
    }
};