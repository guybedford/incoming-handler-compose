import { componentize } from '@bytecodealliance/componentize-js';
import { writeFile } from 'node:fs/promises';

const { component } = await componentize(`
  import { handle } from 'wasi:http/incoming-handler';

  export const incomingHandler = {
    handle (incomingRequest, outgoingResponse) {
      handle(incomingRequest, outgoingResponse);
    }
  };
`, {
  witPath: 'wit',
  worldName: 'test-incoming-hook',
  preview2Adapter: 'wasi_snapshot_preview1.wasm',
});

await writeFile('component.wasm', component);

console.log('Created component.wasm');
