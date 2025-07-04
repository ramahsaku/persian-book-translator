import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [translated, setTranslated] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Select a file first');

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/extract-text', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setText(data.text || '');
    setLoading(false);
  };

  const handleTranslate = async () => {
    setLoading(true);
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    setTranslated(data.translation || '');
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20, fontFamily: 'Arial' }}>
      <h1>📖 Persian ➜ Indonesian Book Translator</h1>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".pdf,.txt" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit" style={{ marginLeft: 10 }}>Extract Text</button>
      </form>

      {loading && <p>Loading...</p>}

      {text && (
        <>
          <h2>📝 Persian Text</h2>
          <textarea rows={10} style={{ width: '100%' }} value={text} readOnly />
          <button onClick={handleTranslate} style={{ marginTop: 10 }}>Translate</button>
        </>
      )}

      {translated && (
        <>
          <h2>🌍 Indonesian Translation</h2>
          <textarea rows={10} style={{ width: '100%' }} value={translated} readOnly />
        </>
      )}
    </div>
  );
}
