import chalk from 'chalk';
import Table from 'cli-table3';
import Fuse from 'fuse.js';
import type { MCPServer } from '../types';
import { getRegistry } from '../services/registry';

export async function searchCommand(query: string, opts: { noCache: boolean }): Promise<void> {
  const servers = await getRegistry(opts.noCache);

  let results: MCPServer[];

  if (!query || query.trim() === '') {
    results = servers;
  } else {
    const fuse = new Fuse(servers, {
      keys: ['name', 'description', 'tags'],
      threshold: 0.4,
    });
    results = fuse.search(query).map((r) => r.item);
  }

  if (results.length === 0) {
    console.log(`No results for "${query}". Try: mcp-butler list`);
    return;
  }

  printTable(results);
}

export function printTable(servers: MCPServer[]): void {
  const table = new Table({
    head: [chalk.bold('ID'), chalk.bold('NAME'), chalk.bold('DESCRIPTION')],
    style: { head: [], border: [] },
    colWidths: [22, 20, 46],
    wordWrap: true,
  });

  for (const s of servers) {
    table.push([s.id, s.name, s.description]);
  }

  console.log(table.toString());
}
