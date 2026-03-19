module.exports = {
    isDev: true,
    port: 3003, // request port
    socketPort: 3004,
    version: "v1.0.0",
    mysql: {
        host: "localhost",
        port: "3306",
        user: "qing",
        password: "123456",
        database: "my_chat",
        // connectionLimit: 10
    },
    request: {
        hostname: "localhost",
        port: null,
        agent: false
    },
    chatAi: {
        uid: '666666',
        hostname: 'localhost',
        port: 3001,
        greetings:"你好，我是笨笨，有什么想说的可以对我说哦"
    },
    wxConfig: {
        AppID: "AppID",
        AppSecret: "AppSecret"
    }
}