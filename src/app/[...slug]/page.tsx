import { readFile } from 'fs/promises';
import { join } from 'path';

export default async function CatchAllPage() {
  try {
    const indexPath = join(process.cwd(), 'public', 'index.html');
    const indexHtml = await readFile(indexPath, 'utf8');
    
    return (
      <div dangerouslySetInnerHTML={{ __html: indexHtml }} />
    );
  } catch (error) {
    console.error('Error serving React app:', error);
    return (
      <main style={{ padding: 20 }}>
        <h1>React App Not Found</h1>
        <p>Please build the React app first.</p>
      </main>
    );
  }
}