import chalk from 'chalk';
import type { MCPServer, ArgDef } from '../types';
import { getRegistry } from '../services/registry';

export async function infoCommand(id: string, opts: { noCache: boolean }): Promise<void> {
  const servers = await getRegistry(opts.noCache);
  const server = servers.find((s) => s.id === id);

  if (!server) {
    console.error(`✗ No server found with id "${id}". Run: mcp-hub list`);
    process.exit(1);
  }

  printInfo(server);
}

function resolveDisplayCommand(server: MCPServer): string {
  const parts = [
    server.command,
    ...server.args.map((a: ArgDef) => (typeof a === 'string' ? a : `<${a.name}>`)),
  ];
  return parts.join(' ');
}

function printInfo(server: MCPServer): void {
  console.log('');
  console.log(chalk.bold(server.name));
  console.log(server.description);
  console.log('');
  console.log(`${chalk.dim('ID:')}          ${server.id}`);
  console.log(`${chalk.dim('Category:')}    ${server.category}`);
  if (server.author) console.log(`${chalk.dim('Author:')}      ${server.author}`);
  if (server.tags?.length) console.log(`${chalk.dim('Tags:')}        ${server.tags.join(', ')}`);
  if (server.url) console.log(`${chalk.dim('URL:')}         ${server.url}`);
  if (server.stars != null) console.log(`${chalk.dim('Stars:')}       ${server.stars.toLocaleString()}`);
  console.log('');
  console.log(`${chalk.dim('Command:')}     ${resolveDisplayCommand(server)}`);
  console.log('');
}
