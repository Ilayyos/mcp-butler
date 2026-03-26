#!/usr/bin/env node
import { Command } from 'commander';
import { searchCommand } from './commands/search';
import { listCommand } from './commands/list';
import { infoCommand } from './commands/info';
import { installCommand } from './commands/install';

const program = new Command();

program
  .name('mcp-get')
  .description('Discover and install MCP servers for Claude Desktop')
  .version('0.1.0');

program
  .command('search <query>')
  .description('Search for MCP servers by keyword')
  .option('--no-cache', 'Bypass local registry cache')
  .action((query: string, opts) => searchCommand(query, { noCache: !opts.cache }));

program
  .command('list')
  .description('List all available MCP servers')
  .option('--category <cat>', 'Filter by category')
  .option('--no-cache', 'Bypass local registry cache')
  .action((opts) => listCommand({ category: opts.category, noCache: !opts.cache }));

program
  .command('info <id>')
  .description('Show details for a specific MCP server')
  .option('--no-cache', 'Bypass local registry cache')
  .action((id: string, opts) => infoCommand(id, { noCache: !opts.cache }));

program
  .command('install <id>')
  .description('Install an MCP server into Claude Desktop')
  .option('--no-cache', 'Bypass local registry cache')
  .action((id: string, opts) => installCommand(id, { noCache: !opts.cache }));

program.parse();
