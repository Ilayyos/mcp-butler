import fs from 'fs';
import path from 'path';
import os from 'os';
import type { ClaudeConfig, ClaudeConfigEntry, MCPServer, ArgDef } from '../types';

export function getConfigPath(): string {
  if (process.platform === 'win32') {
    const appdata = process.env['APPDATA'];
    if (!appdata) {
      console.error('✗ %APPDATA% environment variable is not set.');
      process.exit(1);
    }
    return path.join(appdata, 'Claude', 'claude_desktop_config.json');
  }

  if (process.platform === 'darwin') {
    return path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
  }

  // Linux
  return path.join(os.homedir(), '.config', 'Claude', 'claude_desktop_config.json');
}

export function readConfig(configPath: string): ClaudeConfig {
  if (!fs.existsSync(configPath)) {
    return { mcpServers: {} };
  }

  let raw: string;
  try {
    raw = fs.readFileSync(configPath, 'utf-8');
  } catch (err: any) {
    console.error(`✗ Could not read config file: ${configPath}`);
    console.error(err.message);
    process.exit(1);
  }

  try {
    return JSON.parse(raw) as ClaudeConfig;
  } catch {
    console.error(`✗ Config file contains invalid JSON: ${configPath}`);
    console.error('Please fix the file manually, then try again.');
    process.exit(1);
  }
}

export function writeConfig(configPath: string, config: ClaudeConfig): void {
  try {
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err: any) {
    console.error(`✗ Could not write config file: ${configPath}`);
    console.error(err.message);
    process.exit(1);
  }
}

export function buildConfigEntry(server: MCPServer, userArgs: string[]): ClaudeConfigEntry {
  let userArgIdx = 0;
  const resolvedArgs: string[] = (server.args as ArgDef[]).map((arg) => {
    if (typeof arg === 'string') return arg;
    return userArgs[userArgIdx++] ?? '';
  });

  return { command: server.command, args: resolvedArgs };
}
