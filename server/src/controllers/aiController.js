import * as aiService from '../services/ai/aiService.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * POST /api/v1/ai/chat
 */
export const chat = async (req, res, next) => {
  try {
    const { conversationId, message, language } = req.body;

    if (!message || message.trim().length === 0) {
      return sendError(res, 400, 'EMPTY_MESSAGE', 'Message cannot be empty.');
    }

    const result = await aiService.processChat({
      user: req.user,
      conversationId,
      message: message.trim(),
      language,
    });

    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/ai/conversations
 */
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await aiService.getConversations(req.user._id);
    return sendSuccess(res, { conversations });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/ai/conversations/:conversationId
 */
export const getConversation = async (req, res, next) => {
  try {
    const conversation = await aiService.getConversation(req.user._id, req.params.conversationId);
    if (!conversation) {
      return sendError(res, 404, 'CONVERSATION_NOT_FOUND', 'Conversation not found.');
    }
    return sendSuccess(res, { conversation });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/ai/conversations/:conversationId
 */
export const deleteConversation = async (req, res, next) => {
  try {
    const result = await aiService.deleteConversation(req.user._id, req.params.conversationId);
    if (!result) {
      return sendError(res, 404, 'CONVERSATION_NOT_FOUND', 'Conversation not found.');
    }
    return sendSuccess(res, { message: 'Conversation deleted.' });
  } catch (error) {
    next(error);
  }
};
