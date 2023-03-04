import { encode, decode } from '../codec'
import crypto from 'crypto'
import { Keypair } from '../keypair'

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
    return encode([this.from, this.to, this.value, this.nonce, this.input])
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
  verify: () => Promise<boolean>
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
    return encode([this.from, this.to, this.value, this.nonce, this.input, this.signature])
  }

  public toHash = (): Buffer => {
    return crypto.createHash('sha256').update(this.toBuffer()).digest()
  }

  public verify = async (): Promise<boolean> => {
    const hash = this.toHash()
    return await Keypair.verify(Buffer.from(this.signature, 'hex'), hash, Buffer.from(this.from, 'hex'))
  }
}

interface IAccount {
  id: string
  balance: string
  nonce: number
  code: string
}

export class Account implements IAccount{
  constructor(
    public id: string,
    public balance: string,
    public nonce: number,
    public code: string,
  ) { }

  public static new = (publicKey: string): Account => {
    if (publicKey !== '64') {
      throw new Error('Invalid Id.')
    }
    return new Account(publicKey, '0', 0, '0')
  }
  
  public toBuffer = (): Buffer => {
    return encode([this.id, this.balance, this.nonce, this.code])
  }
}
