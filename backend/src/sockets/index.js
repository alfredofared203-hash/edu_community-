const registerChatHandlers = require('./chat.handler');
const registerPresenceHandlers = require('./presence.handler');


function registerHandlers(io, socket) {
    console.log(`مستخدم جديد اتصل: ${socket.user?.id}`);
    // نضم المستخدم لغرفته الشخصية عشان الإشعارات اللحظية توصله هو بس
    socket.join('user:' + socket.user.id);
    registerPresenceHandlers(io, socket);
    registerChatHandlers(io, socket);
}

module.exports = registerHandlers;