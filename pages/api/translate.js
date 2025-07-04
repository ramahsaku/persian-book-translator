export default async function handler(req, res) {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });

  try {
    const result = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Translate the following Persian text to Indonesian.' },
          { role: 'user', content: text },
        ],
        temperature: 0.3,
      }),
    });

    const json = await result.json();
    const translation = json.choices?.[0]?.message?.content || '';
    res.status(200).json({ translation });
  } catch {
    res.status(500).json({ error: 'Translation failed' });
  }
}
