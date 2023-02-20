import { encode, decode, encodeHexString, encodeNumber } from '../codec/index.js'
import crypto from 'crypto'
import { KeypairTask } from '../keypair/index.js'

interface IUnsignedTransaction {
  from: string
  to: string
  value: string
  nonce: number
  input: string

  toBuffer: () => Buffer
  toHash: () => Buffer
}

export class UnsignedTransaction implements IUnsignedTransaction {
  constructor(
    public from: string,
    public to: string,
    public value: string,
    public nonce: number,
    public input: string,
  ) { }

  public static fromBuffer = (buffer: Buffer): UnsignedTransaction => {
    const buffers = decode(buffer)
    return new UnsignedTransaction(
      buffers[0].toString('hex'),
      buffers[1].toString('hex'),
      buffers[2].toString('hex'),
      buffers[3].readUInt32LE(),
      buffers[4].toString('hex')
    )
  }

  public static fromJson = (str: string): UnsignedTransaction => {
    const { from, to, value, nonce, input } = JSON.parse(str)
    return new UnsignedTransaction(from, to, value, nonce, input)
  }

  public toBuffer = (): Buffer => {
    const buffers = new Array<Buffer>()
    buffers[0] = encodeHexString(this.from)
    buffers[1] = encodeHexString(this.to)
    buffers[2] = encodeHexString(this.value)
    buffers[3] = encodeNumber(this.nonce)
    buffers[4] = encodeHexString(this.input)
    return encode(buffers)
  }

  public toHash = (): Buffer => {
    return crypto.createHash('sha256').update(this.toBuffer()).digest()
  }
}

interface ISignedTransaction {
  from: string
  to: string
  value: string
  nonce: number
  input: string
  signature: string

  toBuffer: () => Buffer
  toHash: () => Buffer
  verify: (keypair: KeypairTask) => Promise<boolean>
}

export class SignedTransaction implements ISignedTransaction {
  constructor(
    public from: string,
    public to: string,
    public value: string,
    public nonce: number,
    public input: string,
    public signature: string
  ) { }

  public static fromBuffer = (buffer: Buffer): SignedTransaction => {
    const buffers = decode(buffer)
    return new SignedTransaction(
      buffers[0].toString('hex'),
      buffers[1].toString('hex'),
      buffers[2].toString('hex'),
      buffers[3].readUInt32LE(),
      buffers[4].toString('hex'),
      buffers[5].toString('hex')
    )
  }

  public static fromJson = (str: string): SignedTransaction => {
    const { from, to, value, nonce, input, signature } = JSON.parse(str)
    return new SignedTransaction(from, to, value, nonce, input, signature)
  }

  public toBuffer = (): Buffer => {
    const buffers = new Array<Buffer>()
    buffers[0] = encodeHexString(this.from)
    buffers[1] = encodeHexString(this.to)
    buffers[2] = encodeHexString(this.value)
    buffers[3] = encodeNumber(this.nonce)
    buffers[4] = encodeHexString(this.input)
    buffers[5] = encodeHexString(this.signature)
    return encode(buffers)
  }

  public toHash = (): Buffer => {
    return crypto.createHash('sha256').update(this.toBuffer()).digest()
  }

  public verify = async (keypair: KeypairTask): Promise<boolean> => {
    const hash = this.toHash()
    return await keypair.verify(Buffer.from(this.signature, 'hex'), hash, Buffer.from(this.from, 'hex'))
  }
}
