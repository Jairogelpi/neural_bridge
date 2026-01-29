
// Use global fetch

const OPENROUTER_API_KEY = process.env.VITE_OPENROUTER_API_KEY;
const MODEL = 'google/gemini-flash-1.5:free';

async function test() {
    console.log(`Testing model: ${MODEL}`);
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: MODEL,
            messages: [{ role: 'user', content: 'Say hello' }],
            max_tokens: 10
        })
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Success:', data.choices[0].message.content);
    } else {
        const err = await response.text();
        console.log('Error:', response.status, err);
    }
}

test();
