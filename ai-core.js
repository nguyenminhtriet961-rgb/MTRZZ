// === AI CHATBOT CORE ===
// Smart response system with scoring algorithm

class AIChatbot {
    constructor() {
        this.knowledgeBase = null;
        this.isLoaded = false;
        this.loadKnowledgeBase();
    }

    // Load knowledge base from JSON file
    async loadKnowledgeBase() {
        try {
            const response = await fetch('data/chatbot.json');
            this.knowledgeBase = await response.json();
            this.isLoaded = true;
            console.log('🤖 AI Chatbot Knowledge Base loaded successfully!');
        } catch (error) {
            console.error('❌ Error loading knowledge base:', error);
            this.knowledgeBase = [];
        }
    }

    // Normalize Vietnamese text (remove accents, convert to lowercase)
    normalizeText(text) {
        return text.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[^a-z0-9\s]/g, '') // Remove special characters
            .trim();
    }

    // Calculate score for matching keywords
    calculateScore(userMessage, keywords) {
        const normalizedUser = this.normalizeText(userMessage);
        const userWords = normalizedUser.split(/\s+/).filter(word => word.length > 0);
        
        let totalScore = 0;
        let matchedWords = 0;

        keywords.forEach(keyword => {
            const normalizedKeyword = this.normalizeText(keyword);
            const keywordWords = normalizedKeyword.split(/\s+/);
            
            // Count matching words
            keywordWords.forEach(kwWord => {
                if (userWords.some(userWord => userWord.includes(kwWord) || kwWord.includes(userWord))) {
                    totalScore += 1;
                    matchedWords++;
                }
            });
        });

        // Bonus for exact phrase matches
        keywords.forEach(keyword => {
            if (normalizedUser.includes(this.normalizeText(keyword))) {
                totalScore += 5; // Bonus points for exact match
            }
        });

        return {
            score: totalScore,
            matchedWords: matchedWords,
            totalWords: userWords.length,
            percentage: userWords.length > 0 ? (matchedWords / userWords.length) * 100 : 0
        };
    }

    // Find best matching response
    findBestResponse(userMessage) {
        if (!this.isLoaded || !this.knowledgeBase.length) {
            return this.getDefaultResponse();
        }

        let bestMatch = null;
        let highestScore = 0;

        // Calculate score for each knowledge base entry
        this.knowledgeBase.forEach(entry => {
            const scoreData = this.calculateScore(userMessage, entry.keywords);
            
            if (scoreData.score > highestScore) {
                highestScore = scoreData.score;
                bestMatch = {
                    ...entry,
                    scoreData: scoreData
                };
            }
        });

        // Return best match if score is above threshold
        if (bestMatch && highestScore > 0) {
            return {
                answer: bestMatch.answer,
                related_link: bestMatch.related_link,
                confidence: Math.min(bestMatch.scoreData.percentage, 100),
                matched_keywords: bestMatch.keywords.filter(kw => 
                    this.normalizeText(userMessage).includes(this.normalizeText(kw))
                )
            };
        }

        return this.getDefaultResponse();
    }

    // Default response when no match found
    getDefaultResponse() {
        const defaultResponses = [
            {
                answer: "Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể thử hỏi về:\n• Game và phần mềm\n• Hướng dẫn cài đặt\n• Sửa lỗi game\n• Liên hệ hỗ trợ",
                related_link: "#game-pc",
                confidence: 0,
                suggestions: ["Game", "Hướng dẫn", "Lỗi", "Liên hệ"]
            },
            {
                answer: "Tôi có thể giúp bạn tìm game, phần mềm, hoặc hướng dẫn sử dụng. Bạn cần gì ạ?",
                related_link: "#game-pc",
                confidence: 0,
                suggestions: ["Game PC", "Office", "Photoshop", "Windows"]
            }
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    // Generate AI response with typing simulation
    async generateResponse(userMessage) {
        // Show typing indicator
        this.showTypingIndicator();

        // Simulate thinking time (1-2 seconds)
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        // Hide typing indicator
        this.hideTypingIndicator();

        // Get response
        const response = this.findBestResponse(userMessage);
        
        return response;
    }

    // Show typing indicator
    showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'chat-message bot typing-indicator';
            typingDiv.id = 'typingIndicator';
            typingDiv.innerHTML = `
                <div class="message-content">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;
            chatMessages.appendChild(typingDiv);
            this.scrollToBottom();
        }
    }

    // Hide typing indicator
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Scroll to bottom of chat
    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 100);
        }
    }

    // Add message to chat
    addMessage(content, isBot = false, response = null) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isBot ? 'bot' : 'user'}`;
        
        if (isBot && response) {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-text">${this.formatMessage(response.answer)}</div>
                    ${response.confidence > 0 ? `<div class="confidence-score">Độ tin cậy: ${response.confidence.toFixed(0)}%</div>` : ''}
                    ${response.related_link ? `
                        <div class="related-link">
                            <a href="${response.related_link}" target="_blank">
                                <i class="fa-solid fa-link"></i> Xem thêm
                            </a>
                        </div>
                    ` : ''}
                    ${response.suggestions ? `
                        <div class="quick-suggestions">
                            ${response.suggestions.map(suggestion => 
                                `<button class="suggestion-btn" onclick="askAI('${suggestion}')">${suggestion}</button>`
                            ).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-text">${content}</div>
                </div>
            `;
        }

        chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    // Format message with line breaks
    formatMessage(text) {
        return text.replace(/\n/g, '<br>');
    }
}

// Initialize global chatbot instance
let aiChatbot;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    aiChatbot = new AIChatbot();
});

// Global function to handle AI requests
async function askAI(message) {
    if (!aiChatbot) {
        console.error('Chatbot not initialized');
        return;
    }

    // Add user message
    aiChatbot.addMessage(message, false);
    
    // Clear input
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.value = '';
    }

    // Generate and add bot response
    const response = await aiChatbot.generateResponse(message);
    aiChatbot.addMessage('', true, response);
}

// Handle Enter key in chat input
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');

    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const message = this.value.trim();
                if (message) {
                    askAI(message);
                }
            }
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', function() {
            const chatInput = document.getElementById('chatInput');
            if (chatInput) {
                const message = chatInput.value.trim();
                if (message) {
                    askAI(message);
                }
            }
        });
    }
});
