import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { readConfig, writeConfig, buildConfigEntry } from '../src/services/config';
import type { MCPServer } from '../src/types';

const tmpFile = () => path.join(os.tmpdir(), `mcp-hub-test-${Date.now()}-${Math.random()}.json`);

describe('buildConfigEntry', () => {
  it('resolves static and user args in order', () => {
    const server: MCPServer = {
      id: 'filesystem',
      name: 'Filesystem',
      description: 'Read/write files',
      category: 'files',
      command: 'npx',
      args: [
        '-y',
        '@modelcontextprotocol/server-filesystem',
        { name: 'allowed-path', description: 'Path', required: true },
      ],
    };

    const entry = buildConfigEntry(server, ['/home/user/projects']);

    expect(entry).toEqual({
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', '/home/user/projects'],
    });
  });

  it('handles a server with only static args', () => {
    const server: MCPServer = {
      id: 'memory',
      name: 'Memory',
      description: 'Key-value memory',
      category: 'productivity',
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-memory'],
    };

    expect(buildConfigEntry(server, [])).toEqual({
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-memory'],
    });
  });
});

describe('readConfig', () => {
  it('returns empty mcpServers when file does not exist', () => {
    const result = readConfig(tmpFile());
    expect(result).toEqual({ mcpServers: {} });
  });

  it('returns parsed config when file exists', () => {
    const p = tmpFile();
    const data = { mcpServers: { fs: { command: 'npx', args: ['-y', '@scope/pkg'] } } };
    fs.writeFileSync(p, JSON.stringify(data), 'utf-8');

    expect(readConfig(p)).toEqual(data);
    fs.unlinkSync(p);
  });

  it('calls process.exit(1) on malformed JSON', () => {
    const p = tmpFile();
    fs.writeFileSync(p, '{ not valid json', 'utf-8');

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);

    readConfig(p);

    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
    fs.unlinkSync(p);
  });
});

describe('writeConfig + readConfig round-trip', () => {
  it('writes then reads back identically', () => {
    const p = tmpFile();
    const config = {
      mcpServers: {
        filesystem: { command: 'npx', args: ['-y', '@scope/pkg', '/path'] },
      },
    };

    writeConfig(p, config);
    expect(readConfig(p)).toEqual(config);
    fs.unlinkSync(p);
  });

  it('writes with 2-space indentation', () => {
    const p = tmpFile();
    writeConfig(p, { mcpServers: {} });
    const raw = fs.readFileSync(p, 'utf-8');
    expect(raw).toBe('{\n  "mcpServers": {}\n}');
    fs.unlinkSync(p);
  });
});
