export type ArgDef =
  | string
  | {
      name: string;
      description: string;
      required: boolean;
    };

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  category: string;
  command: string;
  args: ArgDef[];
  author?: string;
  tags?: string[];
  stars?: number;
  url?: string;
}

export interface ClaudeConfigEntry {
  command: string;
  args: string[];
}

export interface ClaudeConfig {
  mcpServers: Record<string, ClaudeConfigEntry>;
}

export interface CacheFile {
  fetchedAt: string; // ISO timestamp
  servers: MCPServer[];
}
