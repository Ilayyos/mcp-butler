import chalk from 'chalk';
import { prompt } from 'enquirer';
import type { ArgDef } from '../types';
import { getRegistry } from '../services/registry';
import { getConfigPath, readConfig, writeConfig, buildConfigEntry } from '../services/config';

export async function installCommand(id: string, opts: { noCache: boolean }): Promise<void> {
  const servers = await getRegistry(opts.noCache);
  const server = servers.find((s) => s.id === id);

  if (!server) {
    console.error(`✗ No server found with id "${id}". Run: mcp-butler list`);
    process.exit(1);
  }

  // Collect user-supplied args
  const userArgs: string[] = [];
  for (const arg of server.args as ArgDef[]) {
    if (typeof arg === 'string') continue;

    const response = await prompt<{ value: string }>({
      type: 'input',
      name: 'value',
      message: arg.description,
    });

    if (arg.required && !response.value.trim()) {
      console.error(`✗ "${arg.name}" is required.`);
      process.exit(1);
    }

    userArgs.push(response.value.trim());
  }

  const configPath = getConfigPath();
  const config = readConfig(configPath);

  if (!config.mcpServers) config.mcpServers = {};

  const newEntry = buildConfigEntry(server, userArgs);

  // Check for existing entry — show diff and prompt
  if (config.mcpServers[server.id]) {
    console.log(`\n${chalk.yellow('Already installed:')} ${server.id}`);
    console.log('Existing: ' + JSON.stringify(config.mcpServers[server.id]));
    console.log('New:      ' + JSON.stringify(newEntry));

    const { overwrite } = await prompt<{ overwrite: boolean }>({
      type: 'confirm',
      name: 'overwrite',
      message: 'Overwrite?',
      initial: false,
    });

    if (!overwrite) {
      console.log('Aborted.');
      return;
    }
  }

  config.mcpServers[server.id] = newEntry;
  writeConfig(configPath, config);

  console.log(`\n${chalk.green('✓')} ${server.id} added to Claude Desktop. Restart Claude to apply.`);
}
