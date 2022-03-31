// External Import
const mongoId = require('mongoose').Types.ObjectId;

// Internal Import
const Conversation = require('./conversation.model');
const Message = require('./message.model');
const User = require('../user/user.model');
const ExpressError = require('../helpers/expressError');
const asyncWrapper = require('../middleware/async');

// Create Conversation
const createConversation = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;
  const { participantId } = req.body;
  if (!mongoId.isValid(id) || !mongoId.isValid(participantId)) {
    return next(new ExpressError('Invalid Id', 400));
  }
  const findUser = await User.findById(id);
  const participantUser = await User.findById(participantId);
  if (!findUser || !participantUser) {
    return next(new ExpressError('User Does Not Exist', 404));
  }

  const findConversation = await Conversation.findOne({
    $and: [{ creator: findUser._id }, { participant: participantUser._id }]
  });
  if (!findConversation) {
    const newConversation = new Conversation({
      creator: findUser._id,
      participant: participantUser._id
    });
    const conversation = await newConversation.save();

    // Return new conversation as populated
    const resConversation = await conversation.populate({ path: 'participant creator' });
    return res.status(201).json({
      success: true,
      conversation: resConversation
    });
  }

  // Return conversation as populated
  const resConversation = await findConversation.populate({ path: 'participant creator' });
  return res.status(201).json({
    success: true,
    conversation: resConversation
  });
});

// Get Conversation
const getConversation = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;
  if (!mongoId.isValid(id)) {
    return next(new ExpressError('Invalid Id', 400));
  }
  const findUser = await User.findById(id);
  if (!findUser) {
    return next(new ExpressError('User Does Not Exist', 404));
  }

  const getRecentMessages = await Message.find({
    $or: [{ sender: findUser._id }, { receiver: findUser._id }]
  }).sort({ createdAt: 'desc' });

  // extract the conversations ids from messages and append all ids to set
  // because in sets you cant duplicate
  let conversations = new Set();
  getRecentMessages.forEach(message => {
    conversations.add(message.conversation);
  });
  let listOfConversationId = [...conversations];

  // get all the All the conversation with ID
  const allConversations = await Conversation.find({
    _id: { $in: [...listOfConversationId] }
  })
    .sort({ createdAt: 'desc' })
    .populate('participant creator');

  // get all conversations and get the last message
  let conversationArray = [];
  allConversations.forEach(conversation => {
    const getLastMessage = getRecentMessages
      .filter(recentMsg => {
        return recentMsg.conversation.toString() == conversation._id.toString();
      })
      .sort((a, b) => b.createdAt - a.createdAt);
    conversationArray.push({
      conversation,
      lastMessage: getLastMessage[0]
    });
  });

  const sortedConversation = conversationArray.sort(
    (a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt
  );
  res.status(200).json({
    success: true,
    conversations: sortedConversation
  });
});

// Get Messages
const getMessages = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;
  const { conversationId } = req.params;

  if (!mongoId.isValid(id) || !mongoId.isValid(conversationId)) {
    return next(new ExpressError('Invalid Id', 400));
  }
  const findUser = await User.findById(id);
  if (!findUser) {
    return next(new ExpressError('User Does Not Exist', 404));
  }
  //Get Conversation by id and get participants
  const getConversation = await Conversation.findById(conversationId);
  let participants = [getConversation.creator, getConversation.participant];

  //Check if current user is one of the participants
  let isParticipant = participants.some(participant => {
    return findUser._id.toString() === participant.toString();
  });

  if (!isParticipant) {
    return next(new ExpressError('User is not a participant', 404));
  }

  const messages = await Message.find({ conversation: getConversation._id }).sort({
    createdAt: 'desc'
  });

  res.status(200).json({
    success: true,
    messages,
    conversation: getConversation
  });
});

// Get UnseenMessages
const getUnseenMessages = asyncWrapper(async (req, res) => {
  const { id } = req.user;

  if (!mongoId.isValid(id)) {
    return next(new ExpressError('Invalid Id', 400));
  }
  const findUser = await User.findById(id);
  if (!findUser) {
    return next(new ExpressError('User Does Not Exist', 404));
  }
  const getMessages = await Message.find({
    $and: [{ receiver: findUser._id }, { seen: false }]
  });
  res.json({
    success: true,
    messages: getMessages
  });
});

module.exports = {
  createConversation,
  getConversation,
  getMessages,
  getUnseenMessages
};
