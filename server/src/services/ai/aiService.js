import Conversation from '../../models/Conversation.js';
import Scheme from '../../models/Scheme.js';
import { evaluateMultipleSchemes } from '../eligibility/eligibilityEngine.js';
import logger from '../../utils/logger.js';

/**
 * AI Service — orchestrates intent detection, retrieval, eligibility, and response generation.
 *
 * In this hackathon build, the AI runs locally without an external LLM call.
 * When OPENAI_API_KEY is configured, the LLM provider can be swapped in.
 * For now, this uses a rule-based "smart assistant" approach:
 *   - Intent detection via keyword matching
 *   - Eligibility via the deterministic engine
 *   - Responses are structured and templated
 */

// ── Intent Detection ──────────────────────────────────────────────
const INTENT_PATTERNS = {
  SCHEME_DISCOVERY: [
    'scheme', 'schemes', 'benefit', 'benefits', 'yojana', 'sarkari',
    'government', 'what can i get', 'find scheme', 'eligible',
  ],
  ELIGIBILITY: [
    'eligibility', 'eligible', 'qualify', 'match', 'criteria',
    'am i eligible', 'do i qualify',
  ],
  DOCUMENT_EXPLANATION: [
    'document', 'documents', 'certificate', 'proof', 'paper',
    'what documents', 'dastavez',
  ],
  SCHEME_EXPLANATION: [
    'explain', 'tell me about', 'what is', 'how does', 'details',
  ],
  APPLICATION_GUIDANCE: [
    'apply', 'application', 'how to apply', 'process', 'avedan',
  ],
  GENERAL_HELP: [
    'help', 'hello', 'hi', 'namaste', 'start', 'guide',
  ],
};

function detectIntent(message) {
  const lower = message.toLowerCase();
  for (const [intent, keywords] of Object.entries(INTENT_PATTERNS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return intent;
    }
  }
  return 'GENERAL_HELP';
}

// ── Response Generators ───────────────────────────────────────────
function generateSchemeDiscoveryResponse(recommendations) {
  if (!recommendations || recommendations.length === 0) {
    return 'I could not find any matching schemes based on your current profile. Please make sure your profile is complete with accurate details like state, income, occupation, and other relevant information.';
  }

  const relevant = recommendations.filter((r) => r.status !== 'NOT_CURRENTLY_MATCHED');
  if (relevant.length === 0) {
    return 'Based on your current profile, no schemes appear to match at this time. This might change if you update your profile with more details. Please check that your information is up to date.';
  }

  let response = `Based on your profile, I found **${relevant.length} scheme(s)** that may be relevant to you:\n\n`;
  relevant.slice(0, 5).forEach((r, i) => {
    const statusEmoji = r.status === 'POTENTIALLY_RELEVANT' ? '🟢' : '🟡';
    response += `${i + 1}. ${statusEmoji} **${r.schemeName}** — ${r.status.replace(/_/g, ' ').toLowerCase()}\n`;
    if (r.matchedCriteria.length > 0) {
      response += `   ✓ Matched: ${r.matchedCriteria.join(', ')}\n`;
    }
    if (r.needsVerification.length > 0) {
      response += `   ⚠ Needs verification: ${r.needsVerification.join(', ')}\n`;
    }
    response += '\n';
  });

  return response;
}

function generateGeneralHelpResponse() {
  return `Namaste! 🙏 I'm SevaConnect AI, your Government Benefits Assistant.

I can help you with:
• **Find Schemes** — Discover government schemes you may qualify for
• **Check Eligibility** — Understand if you match a scheme's criteria
• **Explain Documents** — Learn which documents you need and how to get them
• **Explain Schemes** — Get simple explanations of complex schemes

Try asking: "Which schemes can I get?" or "What documents do I need?"`;
}

function generateEligibilityResponse(recommendations) {
  if (!recommendations || recommendations.length === 0) {
    return 'Please complete your profile first so I can check your eligibility for government schemes.';
  }

  let response = '## Your Eligibility Summary\n\n';
  recommendations.slice(0, 10).forEach((r) => {
    const emoji = r.status === 'POTENTIALLY_RELEVANT' ? '🟢' : r.status === 'NEEDS_VERIFICATION' ? '🟡' : '🔴';
    response += `${emoji} **${r.schemeName}** (Score: ${Math.round(r.score * 100)}%)\n`;
    r.matchedCriteria.forEach((c) => { response += `  ✓ ${c}\n`; });
    r.failedCriteria.forEach((c) => { response += `  ✗ ${c}\n`; });
    r.needsVerification.forEach((c) => { response += `  ⚠ ${c}\n`; });
    response += '\n';
  });

  return response;
}

function generateDocumentResponse(schemes) {
  if (!schemes || schemes.length === 0) {
    return 'I couldn\'t find relevant schemes to check document requirements. Please try asking about a specific scheme.';
  }

  let response = '## Required Documents\n\n';
  schemes.slice(0, 5).forEach((scheme) => {
    if (scheme.requiredDocuments && scheme.requiredDocuments.length > 0) {
      response += `### ${scheme.name}\n`;
      scheme.requiredDocuments.forEach((doc) => {
        const icon = doc.mandatory ? '📄' : '📎';
        response += `${icon} **${doc.name}**${doc.description ? ` — ${doc.description}` : ''}\n`;
      });
      response += '\n';
    }
  });

  return response || 'No specific document requirements found for the matched schemes.';
}

// ── Main Chat Handler ─────────────────────────────────────────────

/**
 * Process a chat message from the user.
 */
export async function processChat({ user, conversationId, message, language = 'en' }) {
  const intent = detectIntent(message);
  let responseContent = '';
  let recommendations = [];
  let sources = [];

  try {
    // Fetch schemes for eligibility / discovery intents
    if (['SCHEME_DISCOVERY', 'ELIGIBILITY', 'DOCUMENT_EXPLANATION'].includes(intent)) {
      const schemes = await Scheme.find({ isActive: true });

      if (user.profile) {
        const profileData = user.profile.toObject ? user.profile.toObject() : user.profile;
        recommendations = evaluateMultipleSchemes(profileData, schemes);
      }

      switch (intent) {
        case 'SCHEME_DISCOVERY':
          responseContent = generateSchemeDiscoveryResponse(recommendations);
          break;
        case 'ELIGIBILITY':
          responseContent = generateEligibilityResponse(recommendations);
          break;
        case 'DOCUMENT_EXPLANATION': {
          const matchedSchemes = recommendations
            .filter((r) => r.status !== 'NOT_CURRENTLY_MATCHED')
            .map((r) => schemes.find((s) => String(s._id) === String(r.schemeId)))
            .filter(Boolean);
          responseContent = generateDocumentResponse(matchedSchemes);
          break;
        }
      }

      // Add source citations
      const matchedIds = recommendations
        .filter((r) => r.status !== 'NOT_CURRENTLY_MATCHED')
        .slice(0, 5)
        .map((r) => ({
          title: r.schemeName,
          schemeId: String(r.schemeId),
          sourceType: 'OFFICIAL',
        }));
      sources = matchedIds;
    } else if (intent === 'GENERAL_HELP') {
      responseContent = generateGeneralHelpResponse();
    } else if (intent === 'SCHEME_EXPLANATION') {
      responseContent = 'Please specify which scheme you\'d like me to explain. You can ask "Tell me about [scheme name]" or browse the Schemes page to find specific schemes.';
    } else if (intent === 'APPLICATION_GUIDANCE') {
      responseContent = 'To apply for a government scheme:\n\n1. **Complete your profile** with accurate details\n2. **Check your eligibility** using our tool\n3. **Gather required documents**\n4. **Visit the official portal** linked on the scheme page\n5. **Submit your application** with all documents\n\nWould you like me to find schemes you can apply for?';
    } else {
      responseContent = 'I\'m here to help with government schemes and benefits. Try asking about schemes, eligibility, or required documents!';
    }
  } catch (error) {
    logger.error('AI processing error', { error: error.message });
    responseContent = 'I encountered an issue while processing your request. Please try again or ask a different question.';
  }

  // Persist conversation
  let conversation;
  if (conversationId) {
    conversation = await Conversation.findOne({ _id: conversationId, user: user._id });
  }

  if (!conversation) {
    conversation = new Conversation({
      user: user._id,
      title: message.slice(0, 50),
      language,
      messages: [],
    });
  }

  // Add user message
  conversation.messages.push({ role: 'user', content: message });

  // Add assistant message
  conversation.messages.push({
    role: 'assistant',
    content: responseContent,
    intent,
    sources,
  });

  await conversation.save();

  const lastMessage = conversation.messages[conversation.messages.length - 1];

  return {
    conversationId: conversation._id,
    message: {
      id: lastMessage._id,
      role: 'assistant',
      content: responseContent,
    },
    intent,
    recommendations: recommendations
      .filter((r) => r.status !== 'NOT_CURRENTLY_MATCHED')
      .slice(0, 5)
      .map((r) => ({
        schemeId: r.schemeId,
        status: r.status,
        score: r.score,
        matchedCriteria: r.matchedCriteria,
        needsVerification: r.needsVerification,
      })),
    sources,
    disclaimer: 'Final eligibility is determined by the relevant authority.',
  };
}

/**
 * Get all conversations for a user.
 */
export async function getConversations(userId) {
  return Conversation.find({ user: userId })
    .select('title language createdAt updatedAt')
    .sort({ updatedAt: -1 });
}

/**
 * Get a single conversation by ID (owned by user).
 */
export async function getConversation(userId, conversationId) {
  return Conversation.findOne({ _id: conversationId, user: userId });
}

/**
 * Delete a conversation (owned by user).
 */
export async function deleteConversation(userId, conversationId) {
  return Conversation.findOneAndDelete({ _id: conversationId, user: userId });
}
