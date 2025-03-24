const express = require('express');
const fetch = require('node-fetch'); // npm install node-fetch
const app = express();

app.use(express.json());

app.post('/api/deepseek-insights', async (req, res) => {
    const API_KEY = 'sk-c05cfd72b35e4811945b64df98053f7b'; // Securely stored here
    const query = req.body.query || 'strategies and budgeting';

    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant specializing in Pi Network insights.' },
                    { role: 'user', content: `Explain Pi Network ${query} with practical examples. Include:
                        1. Optimal strategy for Pi growth
                        2. Budget allocation recommendations
                        3. Factors driving Pi value increase
                        4. 6-month price prediction
                        Format the response with clear sections using markdown headings (##) and bullet points (-).` }
                ],
                max_tokens: 1000,
                temperature: 0.7
            })
        });

        const data = await response.json();
        res.json({ content: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
