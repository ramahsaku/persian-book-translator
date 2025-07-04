import formidable from 'formidable';
import fs from 'fs';
import pdfParse from 'pdf-parse';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err || !files.file) return res.status(400).json({ error: 'Failed to read file' });

    const filePath = files.file[0].filepath;
    const ext = files.file[0].originalFilename.split('.').pop().toLowerCase();

    try {
      let text = '';
      if (ext === 'txt') {
        text = fs.readFileSync(filePath, 'utf8');
      } else if (ext === 'pdf') {
        const buffer = fs.readFileSync(filePath);
        const data = await pdfParse(buffer);
        text = data.text;
      }
      res.status(200).json({ text });
    } catch {
      res.status(500).json({ error: 'Text extraction failed' });
    }
  });
}
