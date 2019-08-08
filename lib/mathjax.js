const mjAPI = require("mathjax-node");

const svg2png = require("svg2png");


const FORMATS = ['svg', 'html', 'png', 'mml'];
const DISPLAY = ['inline', 'block'];

const checkParams = function(params) {

    let ret = {
        ok: false,
        err: 'params err'
    };
    if (!params.format || !params.tex) {
        return ret;
    }
    params.format = params.format.toString().toLowerCase();
    let find = false;
    for (let i = 0; i < FORMATS.length; i++) {
        if (params.format === FORMATS[i]) {
            find = true;
            break;
        }
    }
    if (!find) {
        return ret;
    }
    if (params.display) {
        params.display = params.display.toString().toLowerCase();
        if (params.display !== DISPLAY[0] && params.display !== DISPLAY[1]) {
            return ret;
        }
    }
    ret.ok = true;
    return ret;
}

const isPng = function(format) {
    return format === 'png';
};
const getContentType = function(format) {
    let ct = 'text/plain';
    switch (format) {
        case 'html':
            ct = 'text/html';
            break;
        case 'mml':
            ct = 'text/html';
            break;
        case 'svg':
            ct = 'image/svg+xml';
            break;
        case 'png':
            ct = 'image/png';
            break;
    }
    return ct;

};
const getConfig = function(params) {

    let config = {
        math: params.tex,
        format: "inline-TeX",
        width: 0
    };
    if (isPng(params.format)) {
        config.svg = true;
        config.isPng = true;
    } else {
        config[params.format] = true;
    }
    if (params.display && params.display === 'block') {
        config.format = 'TeX';
    }
    if (params.width) {
        if (!isNaN(parseInt(params.width)) && parseInt(params.width) > 0) {
            config.width = parseInt(params.width);
        }
    }
    return config;
};
const converter = function(params) {

    return new Promise((res, rej) => {
        const ck = checkParams(params);
        if (!ck.ok) {
            rej(ck.err)
            return;
        }

        const config = getConfig(params);

        let result = {
            format: params.format,
            data: null,
            isPng: config.isPng,
            contentType: getContentType(params.format)
        };

        mjAPI.typeset(config, (data) => {
            if (data.errors) {
                rej(data.errors);
                return;
            }
            if (config.isPng) {
                const buf = Buffer.from(data.svg);
                const scale = 1;
                const EXTOPX = 6;
                let pngWidth = data.width.substring(0, data.width.length - 2) * EXTOPX * scale;
                if (config.width > 0) {
                    pngWidth = config.width;
                }
                svg2png(buf, { width: pngWidth }).then(buffer => {
                    result.data = buffer;
                    res(result);
                }).catch(e => rej(e));
            } else {
                result.data = data[params.format];
                res(result);
            }
        });
    });

};

exports.converter = function(params) {
    return converter(params);

};