import axios from 'axios';
import fs from 'fs';
import path from 'path';
import os from 'os';
import type { MCPServer, CacheFile } from '../types';

const REGISTRY_URL =
  'https://raw.githubusercontent.com/Ilayyos/mcp-butler/main/registry/servers.json';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCachePath(): string | null {
  try {
    return path.join(os.homedir(), '.mcp-hub', 'cache.json');
  } catch {
    return null;
  }
}

function readCache(cachePath: string): { servers: MCPServer[]; fetchedAt: Date } | null {
  try {
    const raw = fs.readFileSync(cachePath, 'utf-8');
    const cache: CacheFile = JSON.parse(raw);
    return { servers: cache.servers, fetchedAt: new Date(cache.fetchedAt) };
  } catch {
    return null;
  }
}

function writeCache(cachePath: string, servers: MCPServer[]): void {
  try {
    fs.mkdirSync(path.dirname(cachePath), { recursive: true });
    const cache: CacheFile = { fetchedAt: new Date().toISOString(), servers };
    fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf-8');
  } catch {
    // Non-fatal: cache write failure is silently ignored
  }
}

function readBundled(): MCPServer[] {
  const bundledPath = path.join(__dirname, '../registry/servers.json');
  const raw = fs.readFileSync(bundledPath, 'utf-8');
  return JSON.parse(raw) as MCPServer[];
}

export async function getRegistry(noCache: boolean): Promise<MCPServer[]> {
  const cachePath = getCachePath();

  // 1. Use fresh cache if available and not bypassed
  if (!noCache && cachePath) {
    const cached = readCache(cachePath);
    if (cached) {
      const ageMs = Date.now() - cached.fetchedAt.getTime();
      if (ageMs < CACHE_TTL_MS) {
        return cached.servers;
      }
    }
  }

  // 2. Fetch live
  try {
    const response = await axios.get<MCPServer[]>(REGISTRY_URL, { timeout: 10000 });
    const servers = response.data;
    if (cachePath) writeCache(cachePath, servers);
    return servers;
  } catch {
    if (noCache) {
      console.error('✗ Could not reach registry. Check your connection.');
      process.exit(1);
    }

    // 3. Fall back to stale cache
    if (cachePath) {
      const cached = readCache(cachePath);
      if (cached) {
        console.warn(
          `⚠ Could not reach registry — using cached version from ${cached.fetchedAt.toLocaleString()}`
        );
        return cached.servers;
      }
    }

    // 4. Fall back to bundled
    console.warn('⚠ Using bundled registry. Run mcp-butler search --no-cache to refresh.');
    return readBundled();
  }
}
