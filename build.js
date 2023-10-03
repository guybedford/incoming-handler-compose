import { componentize } from '@bytecodealliance/componentize-js';
import { writeFile } from 'node:fs/promises';

const { component } = await componentize(`
  import { newFields, newOutgoingResponse, outgoingResponseWrite, setResponseOutparam, outgoingBodyWrite, outgoingBodyFinish } from 'wasi:http/types';
  import { blockingWriteAndFlush, dropOutputStream } from 'wasi:io/streams';

  export const incomingHandler = {
    handle (req, res) {
      console.log('HANDLE');
      const headers = newFields([]);
      const response = newOutgoingResponse(200, headers);
      const body = outgoingResponseWrite(response);
      setResponseOutparam(res, { tag: 'ok', value: response });
      const out = outgoingBodyWrite(body);
      blockingWriteAndFlush(out, "hello world");
      dropOutputStream(out);
      outgoingBodyFinish(body);
    }
  };
`, {
  witPath: 'wit',
  worldName: 'wasi:http/proxy',
  preview2Adapter: 'wasi_snapshot_preview1.wasm',
  enableStdout: true,
});

await writeFile('component.wasm', component);

console.log('Created component.wasm');
