import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'content', 'products');
const OUT_DIR = path.join(ROOT, 'assets');
const OUT_FILE = path.join(OUT_DIR, 'products.json');

function parseFrontMatter(md) {
  const FM = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;
  const m = md.match(FM);
  if (!m) return { data: {}, body: md };
  const raw = m[1];
  const body = m[2] || '';
  const data = {};
  raw.split('\n').forEach(line => {
    const i = line.indexOf(':');
    if (i > -1) {
      const k = line.slice(0, i).trim();
      let v = line.slice(i + 1).trim();
      if (/^(true|false)$/i.test(v)) v = v.toLowerCase() === 'true';
      else if (!isNaN(Number(v))) v = Number(v);
      else v = v.replace(/^"(.*)"$/, '$1');
      data[k] = v;
    }
  });
  return { data, body };
}

function build() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.log('No hay content/products, se generará un JSON vacío.');
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(OUT_FILE, JSON.stringify([], null, 2));
    return;
  }

  const files = fs.readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.md'))
    .sort();

  const items = files.map(filename => {
    const filepath = path.join(CONTENT_DIR, filename);
    const slug = filename.replace(/\.md$/, '');
    const md = fs.readFileSync(filepath, 'utf8');
    const { data, body } = parseFrontMatter(md);

    return {
      slug,
      title: data.title || slug,
      category: data.category || '',
      image: data.image || '',
      summary: data.summary || '',
      buy_url: data.buy_url || '',
      why: data.why || '',
      rating: typeof data.rating === 'number' ? data.rating : 0,
      featured: !!data.featured,
      date: data.date || '',
      draft: !!data.draft,
      body
    };
  });

  const published = items.filter(x => !x.draft);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(published, null, 2));
  console.log(`Generado ${OUT_FILE} con ${published.length} productos.`);
}

build();
