export default defineNitroPlugin(() => {
  process.env.UV_USE_IO_URING = '0'
  process.env.NODE_OPTIONS = '--no-experimental-wasm-modules'
  process.env.LLHTTP_FORCE_PORT = 'true'
})