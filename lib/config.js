const config = {
    port: process.env.port || 4100,
    logSize: process.env.LOG_SIZE || '2M',
    logMaxFiles: parseInt(process.env.LOG_MAX_FILES) == NaN || 100
};

module.exports = config;