import { RPCTask } from '../rpc'
import { ITask, TaskManager } from '../task'

export class TxPoolTask implements ITask {
  manager: TaskManager

  name = () => 'tx-pool'

  init = async (manager: TaskManager): Promise<void> => {
    this.manager = manager
  }

  start = async (): Promise<void> => { }

  stop = async (): Promise<void> => { }
}