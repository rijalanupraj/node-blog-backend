// External Dependencies
const express = require('express');

// Internal Dependencies
const chatController = require('./chat.controller');
const isAuth = require('../middleware/auth');

// Router Setup
const Router = express.Router();

/*
 * @route   POST /
 * @desc    Create New Conversation
 * @access  Private
 */
Router.post('/create', isAuth, chatController.createConversation);

/*
 * @route   GET /
 * @desc    Get Conversations
 * @access  Private
 */
Router.get('/conversations', isAuth, chatController.getConversation);
/*
 * @route   GET /
 * @desc    Get Messages
 * @access  Private
 */
Router.get('/messages/:conversationId', isAuth, chatController.getMessages);

/*
 * @route   GET /
 * @desc    Get Unseen Messages
 * @access  Private
 */
Router.get('/unseen/messages', isAuth, chatController.getUnseenMessages);

module.exports = Router;
