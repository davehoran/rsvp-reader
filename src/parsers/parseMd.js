import { marked } from 'marked';

function tokensToText(tokens) {
  let out = '';
  for (const tok of tokens) {
    switch (tok.type) {
      case 'heading':
        out += tokensToText(tok.tokens) + '\n\n';
        break;
      case 'paragraph':
        out += tokensToText(tok.tokens) + '\n\n';
        break;
      case 'list':
        for (const item of tok.items) {
          out += tokensToText(item.tokens) + '\n';
        }
        out += '\n';
        break;
      case 'list_item':
        out += tokensToText(tok.tokens);
        break;
      case 'blockquote':
        out += tokensToText(tok.tokens) + '\n\n';
        break;
      case 'code':
        out += tok.text + '\n\n';
        break;
      case 'text':
        out += (tok.tokens ? tokensToText(tok.tokens) : tok.text);
        break;
      case 'strong':
      case 'em':
      case 'del':
      case 'link':
        out += tokensToText(tok.tokens || []);
        break;
      case 'codespan':
        out += tok.text;
        break;
      case 'br':
        out += '\n';
        break;
      case 'space':
        out += '\n';
        break;
      default:
        if (tok.tokens) out += tokensToText(tok.tokens);
        else if (tok.raw) out += tok.raw;
    }
  }
  return out;
}

export async function parseMd(file) {
  const raw = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read markdown file'));
    reader.readAsText(file);
  });
  const tokens = marked.lexer(raw);
  return tokensToText(tokens);
}
