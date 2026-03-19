module.exports = {
    isProd: true,
    port: 3003, // request port
    socketPort: 3004,
    version: "v1.0.0",
    mysql: {
        host: "39.104.20.4",
        port: "3306",
        user: "qing",
        password: "wqs7217",
        database: "my_chat",
        // connectionLimit: 10
    },
    request: {
        hostname: "localhost",
        port: null,
        agent: false
    },
    // 智能聊天
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