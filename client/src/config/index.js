const config = {
    requestUrl: '',
    uploadUrl: '',
    socketUrl: '',
    isDev: null,
};

const isDev = process.env.NODE_ENV === 'development';

config.isDev = isDev;

if(isDev) {
    config.requestUrl = "http://127.0.0.1:3003/";
    config.uploadUrl = "http://127.0.0.1:3002/";
    // config.socketUrl = "ws://sockect.test.xin";
    config.socketUrl = "ws://127.0.0.1:3004";
    // config.socketUrl = "ws://sockect.bubaocloud.xin";
    // config.socketUrl = "ws://127.0.0.1:3100";
} else {
    config.requestUrl = ";
    config.uploadUrl = "";
    config.socketUrl = "";
}

module.exports = config