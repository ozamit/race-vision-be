const callGeminiAPI = async (prompt) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(`Gemini API error: ${res.status} ${res.statusText} - ${errorData?.error?.message || JSON.stringify(errorData?.error) || 'No details'}`);
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw error;
    }
};

const trackInsight = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ message: 'Prompt required' });

        const geminiResponse = await callGeminiAPI(prompt);
        const aiResponseText = geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

        res.status(200).json({ success: true, data: aiResponseText, fullResponse: geminiResponse });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed', error: error.message });
    }
};

module.exports = { trackInsight };
