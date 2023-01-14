import { encode } from '../codec'
import { ITask, TaskManager } from '../task'
import crypto from 'crypto'

export class TxPoolTask implements ITask {
  manager: TaskManager
  ready: Map<Buffer, Buffer[]>

  name = () => 'txpool'

  init = async (manager: TaskManager): Promise<void> => {
    this.ready = new Map<Buffer, Buffer[]>()
    this.manager = manager
  }

  start = async (): Promise<void> => { }

  stop = async (): Promise<void> => { 
    console.log('txpool has stopped')
  }

  add = (tx: Buffer[]) => {
    const message = encode(tx.slice(0, 5))
    const hash = crypto.createHash('sha256').update(message).digest()
    if (!this.ready.has(hash)) {
      this.ready.set(hash, tx)
    }
    return hash
  }
}