const encodeHexString = (str: string): Buffer => {
  if (str.startsWith('0x')) {
    str = str.slice(2)
  }
  if (str.length % 2 === 1) {
    str = `0${str}`
  }
  return Buffer.from(str, 'hex')
}

const encodeNumber = (num: number): Buffer => {
  const u32a = new Uint32Array(1)
  u32a[0] = num
  return Buffer.from(new Uint8Array(u32a.buffer))
}

const bufferLength = (buffer: Buffer): Uint8Array => {
  const u32a = new Uint32Array(1)
  u32a[0] = buffer.length
  return new Uint8Array(u32a.buffer)
}

const encode = (values: Array<any>): Buffer => {
  const buffers = new Array<Buffer>()
  for (const value of values) {
    let buffer: Buffer;
    if (typeof value === 'string') {
      buffer = encodeHexString(value)
    } else if (typeof value === 'number') {
      buffer = encodeNumber(value)
    } else {
      throw new Error('Not support type.')
    }
    buffers.push(Buffer.concat([bufferLength(buffer), buffer]))
  }
  return Buffer.concat(buffers)
}

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
  encodeHexString,
  encodeNumber,
  encode,
  decode,
}