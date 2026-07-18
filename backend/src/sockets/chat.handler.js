const { saveMessage } = require('../services/chat/chat.service');


const roomName = (grade) => `grade_${grade}`;

function registerChatHandlers(io, socket) {

  socket.on('join_room', (grade) => {
    const { role, grade: userGrade } = socket.user;

    if (role === 'student' && userGrade !== grade) {
      return socket.emit('error', { error: 'لا يمكنك الانضمام لغرفة صف آخر' });
    }

    socket.join(roomName(grade));
    socket.emit('joined', { grade }); 
  });

  
  socket.on('send_message', async ({ grade, content }) => {
    if (!grade || !content?.trim()) {
      return socket.emit('error', { error: 'الصف والمحتوى مطلوبان' });
    }


    if (!socket.rooms.has(roomName(grade))) {
      return socket.emit('error', { error: 'يجب الانضمام للغرفة أولاً' });
    }

    try {
      const message = await saveMessage({ sender: socket.user.id, grade, content: content.trim() });
  
      io.to(roomName(grade)).emit('new_message', message.toJSON());
    } catch (e) {
      console.error('خطأ في حفظ الرسالة:', e.message);
      socket.emit('error', { error: 'حدث خطأ أثناء إرسال الرسالة' });
    }
  });

}

module.exports = registerChatHandlers;
