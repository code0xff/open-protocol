const encode = (buffers: Buffer[]): Buffer =>
  Buffer.concat(buffers.map(buffer => {
    const u32a = new Uint32Array(1)
    u32a[0] = buffer.length
    const u8a = new Uint8Array(u32a.buffer)
    return Buffer.concat([u8a, buffer])
  }))

const decode = (buffer: Buffer): Buffer[] => {
  let index = 0
  const ret = new Array<Buffer>()
  while (index < buffer.length) {
    const buf = buffer.subarray(index, index + 4)
    const len = buf.readInt32LE()
    ret.push(Buffer.from(buffer.subarray(index + 4, index + 4 + len)))
    index += (4 + len)
  }
  return ret
}

export {
  encode,
  decode,
}