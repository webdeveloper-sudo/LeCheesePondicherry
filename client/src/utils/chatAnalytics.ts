// Chat analytics logging utility
export interface ChatLog {
    timestamp: string;
    sessionId: string;
    userQuery: string;
    botResponse: string;
    userLocation?: string;
    userName?: string;
    userEmail?: string;
    productsMentioned?: string[];
}

export async function logChatInteraction(log: ChatLog) {
    try {
        const response = await fetch('/api/log-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(log),
        });
        return await response.json();
    } catch (error) {
        console.error('Failed to log chat interaction:', error);
        return { success: false };
    }
}

// Generate unique session ID
export function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
