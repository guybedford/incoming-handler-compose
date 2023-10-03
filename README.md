### Incoming Handler Composer

Tries to create a composed incoming handler.

Firstly, we have a hello world server.

Building Wasmtime exactly at https://github.com/bytecodealliance/wasmtime/commit/4b288ba88dfe1c2cce720c46bf9d919e54871c61 (before Resources which ComponentizeJS does not support):

With Wasmtime built via:

```
cargo build --features serve --release
```

Then:

```
./target/release/wasmtime serve wasi_http_proxy_tests.wasm
```

where `curl http://localhost:8080` returns `"hello world"`.

We then try to compose this incoming handler with a ComponentizeJS incoming handler:

```
git clone https://github.com/guybedford/incoming-handler-compose
cd incoming-handler-compose
npm install
node build.js
wasm-tools compose component.wasm -d wasi_http_proxy_tests.wasm -o composed.wasm
```

where `build.js` contains the JS "wrapper" component:

```js
import { handle } from 'wasi:http/incoming-handler';

export const incomingHandler = {
  handle (incomingRequest, outgoingResponse) {
    handle(incomingRequest, outgoingResponse);
  }
};
```

In theory this composed component should just execute the same?

```
wasmtime serve composed.wasm
```

Seems to work? But curling fails -

```
curl http://localhost:8080
curl: (7) Failed to connect to localhost port 8080 after 4 ms: Couldn't connect to server
```

Meanthile the Wasmtime process seems to stall.
