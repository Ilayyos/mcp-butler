import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { MCPServer } from '../src/types';

const mockServer: MCPServer = {
  id: 'test-server',
  name: 'Test',
  description: 'A test server',
  category: 'test',
  command: 'npx',
  args: ['-y', '@test/server'],
};

vi.mock('axios');

describe('getRegistry', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns servers from a successful network fetch', async () => {
    const axios = await import('axios');
    vi.mocked(axios.default.get).mockResolvedValueOnce({ data: [mockServer] });

    const { getRegistry } = await import('../src/services/registry');
    const servers = await getRegistry(true); // noCache=true bypasses cache

    expect(servers).toHaveLength(1);
    expect(servers[0].id).toBe('test-server');
  });
});
