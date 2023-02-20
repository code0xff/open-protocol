import * as ed from '@noble/ed25519'
import { ITask, TaskManager } from '../task/index.js'
import crypto from 'crypto'

export interface Keypair {
  privateKey: string,
  publicKey: string,
}

export class KeypairTask implements ITask {
  manager: TaskManager

  name = () => 'keypair'

  init = async (manager: TaskManager): Promise<void> => {
    this.manager = manager
  }

  start = async (): Promise<void> => { }

  stop = async (): Promise<void> => {
    console.log('keypair has stopped')
  }

  public static new = async (): Promise<Keypair> => {
    const privateKey = ed.utils.randomPrivateKey()
    const publicKey = await ed.getPublicKey(privateKey)
    return {
      privateKey: Buffer.from(privateKey).toString('hex'),
      publicKey: Buffer.from(publicKey).toString('hex'),
    }
  }

  public static sign = async (privateKey: Buffer, message: Buffer): Promise<Buffer> => {
    const sha256ed = crypto.createHash('sha256').update(message).digest()
    const signature = await ed.sign(sha256ed, privateKey)
    return Buffer.from(signature)
  }

  public static verify = async (signature: Buffer, message: Buffer, publicKey: Buffer): Promise<boolean> => {
    return ed.verify(signature, message, publicKey)
  }
}