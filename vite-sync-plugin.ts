import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

const syncFile = path.resolve(__dirname, '.crisisconnect-dev-sync.json');
type SyncKey = 'users' | 'ngos' | 'requests' | 'messages' | 'notifications';
type SyncState = Partial<Record<SyncKey, unknown>>;

function readState(): SyncState {
  try {
    return JSON.parse(fs.readFileSync(syncFile, 'utf8')) as SyncState;
  } catch {
    return {};
  }
}

function writeState(state: SyncState) {
  fs.writeFileSync(syncFile, JSON.stringify(state));
}

export const crisisConnectSyncPlugin = (): Plugin => ({
  name: 'crisisconnect-dev-sync',
  configureServer(server) {
    server.middlewares.use('/__crisisconnect', (request, response, next) => {
      const key = request.url?.replace(/^\//, '').split('?')[0] as SyncKey | undefined;
      if (!key || !['users', 'ngos', 'requests', 'messages', 'notifications'].includes(key)) {
        next();
        return;
      }

      if (request.method === 'GET') {
        const value = readState()[key];
        if (value === undefined) {
          next();
          return;
        }
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(value));
        return;
      }

      if (request.method === 'POST') {
        const chunks: Buffer[] = [];
        request.on('data', (chunk: Buffer) => chunks.push(chunk));
        request.on('end', () => {
          try {
            const state = readState();
            state[key] = JSON.parse(Buffer.concat(chunks).toString('utf8'));
            writeState(state);
            response.statusCode = 204;
            response.end();
          } catch {
            response.statusCode = 400;
            response.end();
          }
        });
        return;
      }

      response.statusCode = 405;
      response.end();
    });
  },
});
