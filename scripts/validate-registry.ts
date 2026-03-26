import fs from 'fs';
import path from 'path';

const registryPath = path.join(__dirname, '../registry/servers.json');
const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

let raw: string;
try {
  raw = fs.readFileSync(registryPath, 'utf-8');
} catch {
  console.error('✗ Could not read registry/servers.json');
  process.exit(1);
}

let servers: any[];
try {
  servers = JSON.parse(raw);
} catch {
  console.error('✗ registry/servers.json is not valid JSON');
  process.exit(1);
}

if (!Array.isArray(servers)) {
  console.error('✗ registry/servers.json must be a JSON array');
  process.exit(1);
}

const errors: string[] = [];
const ids = new Set<string>();

for (let i = 0; i < servers.length; i++) {
  const s = servers[i];
  const p = `Entry[${i}]`;

  if (!s.id || typeof s.id !== 'string') {
    errors.push(`${p}: missing required field "id"`);
  } else if (!ID_PATTERN.test(s.id)) {
    errors.push(`${p}: id "${s.id}" must match /^[a-z0-9]+(-[a-z0-9]+)*$/`);
  } else if (ids.has(s.id)) {
    errors.push(`${p}: duplicate id "${s.id}"`);
  } else {
    ids.add(s.id);
  }

  if (!s.name || typeof s.name !== 'string') errors.push(`${p}: missing required field "name"`);
  if (!s.description || typeof s.description !== 'string') errors.push(`${p}: missing required field "description"`);
  if (!s.category || typeof s.category !== 'string') errors.push(`${p}: missing required field "category"`);
  if (!s.command || typeof s.command !== 'string') errors.push(`${p}: missing required field "command"`);

  if (!Array.isArray(s.args)) {
    errors.push(`${p}: "args" must be an array`);
  } else {
    for (let j = 0; j < s.args.length; j++) {
      const arg = s.args[j];
      if (typeof arg !== 'string') {
        if (!arg.name || typeof arg.name !== 'string')
          errors.push(`${p}: args[${j}] missing "name"`);
        if (!arg.description || typeof arg.description !== 'string')
          errors.push(`${p}: args[${j}] missing "description"`);
        if (typeof arg.required !== 'boolean')
          errors.push(`${p}: args[${j}] "required" must be boolean`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error('✗ Validation failed:');
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

console.log(`✓ registry/servers.json is valid (${servers.length} entries)`);
