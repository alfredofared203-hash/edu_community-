const Message = require('../../models/Message');

async function saveMessage({ sender, grade, content }) {
  const msg = await Message.create({ sender, grade, content });
  return msg.populate('sender', 'name role');
}


async function getMessages({ grade, page = 1, limit = 20 }) {
  const skip = (page - 1) * limit;
  const [messages, total] = await Promise.all([
    Message.find({ grade })
      .populate('sender', 'name role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Message.countDocuments({ grade }),
  ]);
  return { messages, total, page, limit, totalPages: Math.ceil(total / limit) };
}

module.exports = { saveMessage, getMessages };
