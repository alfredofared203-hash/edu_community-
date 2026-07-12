
const onlineUsers = new Map();

function registerPresenceHandlers(io, socket) {
    const userId = socket.user.id;


    const count = (onlineUsers.get(userId) || 0) + 1;
    onlineUsers.set(userId, count);

    if (count === 1) {
        socket.broadcast.emit('user_online', { userId });
        console.log(`المستخدم ${userId} أصبح متصلاً`);
    }

  
    socket.emit('online_users', { userIds: [...onlineUsers.keys()] });

   
    socket.on('disconnect', () => {
        try {
            const remaining = (onlineUsers.get(userId) || 1) - 1;

            if (remaining <= 0) {
                onlineUsers.delete(userId);
                io.emit('user_offline', { userId }); 
                console.log(`المستخدم ${userId} أصبح غير متصل`);
            } else {
                onlineUsers.set(userId, remaining);
            }
        } catch (e) {
            console.error('خطأ في تحديث حالة الحضور:', e.message);
        }
    });
}

module.exports = registerPresenceHandlers;