import { getRegistry } from '../services/registry';
import { printTable } from './search';

export async function listCommand(opts: { category?: string; noCache: boolean }): Promise<void> {
  const servers = await getRegistry(opts.noCache);

  let results = servers;

  if (opts.category) {
    results = servers.filter(
      (s) => s.category.toLowerCase() === opts.category!.toLowerCase()
    );
    if (results.length === 0) {
      console.log(
        `No servers found in category "${opts.category}". Run mcp-hub list to see all categories.`
      );
      return;
    }
  }

  printTable(results);
}
