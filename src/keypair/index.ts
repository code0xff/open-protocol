import * as ed from '@noble/ed25519'
import { ITask, TaskManager } from '../task'
import crypto from 'crypto'

interface Keypair {
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

  stop = async (): Promise<void> => { }

  new = async (): Promise<Keypair> => {
    const privateKey = ed.utils.randomPrivateKey()
    const publicKey = await ed.getPublicKey(privateKey)
    return {
      privateKey: Buffer.from(privateKey).toString('hex'),
      publicKey: Buffer.from(publicKey).toString('hex'),
    }
  }

  sign = async (privateKey: Buffer, message: Buffer): Promise<Buffer> => {
    const sha256ed = crypto.createHash('sha256').update(message).digest()
    const signature = await ed.sign(sha256ed, privateKey)
    return Buffer.from(signature)
  }
}