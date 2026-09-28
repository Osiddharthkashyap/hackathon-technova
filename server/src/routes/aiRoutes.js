import { Router } from 'express';
import {
  chat,
  getConversations,
  getConversation,
  deleteConversation,
} from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';
import validate from '../middleware/validation.js';
import { z } from 'zod';

const router = Router();

const chatSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1, 'Message cannot be empty').max(2000),
  language: z.enum(['en', 'hi', 'hinglish']).optional().default('en'),
});

router.post('/chat', authenticate, validate(chatSchema), chat);
router.get('/conversations', authenticate, getConversations);
router.get('/conversations/:conversationId', authenticate, getConversation);
router.delete('/conversations/:conversationId', authenticate, deleteConversation);

export default router;
