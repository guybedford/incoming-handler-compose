### Incoming Handler Component

Incoming handler in JS with ComponentizeJS.

```
git clone https://github.com/guybedford/incoming-handler-compose
cd incoming-handler-compose
npm install
node build.js
```

Should output `Created component.wasm`.

Building Wasmtime exactly at https://github.com/bytecodealliance/wasmtime/commit/4b288ba88dfe1c2cce720c46bf9d919e54871c61 (before Resources which ComponentizeJS does not support):

With Wasmtime built via:

```
cargo build --features serve --release
```

Then:

```
./target/release/wasmtime serve component.wasm
```

Should then work.

`build.js` contains the JS "handler" component:

```js
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
```

Supporting the `console.log()` as writing to the stdout would help in debugging...
