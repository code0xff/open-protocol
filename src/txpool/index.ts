import { ITask, TaskManager } from '../task'
import { SignedTransaction } from '../types'

export class TxPoolTask implements ITask {
  manager: TaskManager
  ready: Map<Buffer, Buffer>

  name = () => 'txpool'

  init = async (manager: TaskManager): Promise<void> => {
    this.ready = new Map<Buffer, Buffer>()
    this.manager = manager
  }

  start = async (): Promise<void> => { }

  stop = async (): Promise<void> => { }

  push = (tx: SignedTransaction): boolean => {
    if (!this.ready.has(tx.toHash())) {
      this.ready.set(tx.toHash(), tx.toBuffer())
      return true
    }
    return false
  }
}