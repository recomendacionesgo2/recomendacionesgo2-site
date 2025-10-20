import fs from 'fs';
import path from 'path';

// Carpeta con los .md
const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'content', 'products');
const OUT_DIR = path.join(ROOT, 'assets');
const OUT_FILE = path.join(OUT_DIR, 'products.json');

// Parser muy simple de front-matter (--- ... --- al inicio)
function parseFrontMatter(md) {
  const FM = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;
  const m = md.match(FM);
  if (!m) return { data: {}, body: md };
  const raw = m[1];
  const body = m[2] || '';
  const data = {};
  const lines = raw.split('\n');
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    const colonIdx = line.indexOf(':');
    
    if (colonIdx > -1) {
      const k = line.slice(0, colonIdx).trim();
      let v = line.slice(colonIdx + 1).trim();
      
      // Manejar multiline (>- o |-)
      if (v === '>-' || v === '|-' || v === '>' || v === '|') {
        const multilines = [];
        i++;
        // Recoger líneas indentadas
        while (i < lines.length && (lines[i].startsWith('  ') || lines[i].trim() === '')) {
          const content = lines[i].replace(/^  /, '');
          if (content.trim() !== '') {
            multilines.push(content);
          }
          i++;
        }
        v = multilines.join(' ').trim();
        i--; // compensar el i++ del while principal
      } else {
        // convierte "true/false/num"
        if (/^(true|false)$/i.test(v)) v = v.toLowerCase() === 'true';
        else if (!isNaN(Number(v))) v = Number(v);
        else v = v.replace(/^"(.*)"$/, '$1');
      }
      
      data[k] = v;
    }
    i++;
  }
  
  return { data, body };
}

// Lee todos los .md y genera un JSON con todos los campos necesarios
function build() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.log('No hay content/products, se generará un JSON vacío.');
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(OUT_FILE, JSON.stringify([], null, 2));
    return;
  }

  const files = fs.readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.md'))
    .sort(); // orden estable por nombre

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
      body // por si quieres usarlo más adelante
    };
  });

  // Sólo ignorar drafts
  const published = items.filter(x => !x.draft);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(published, null, 2));
  console.log(`Generado ${OUT_FILE} con ${published.length} productos.`);
}

build();
