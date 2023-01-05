import { RPCTask } from '../rpc'
import { ITask, TaskManager } from '../task'

export class ApiTask implements ITask {
  manager: TaskManager

  name = () => 'api'

  init = async (manager: TaskManager): Promise<void> => {
    this.manager = manager
  }

  start = async (): Promise<void> => {
    const rpc = this.manager.get<RPCTask>('rpc')
    rpc.addMethod('transfer', (params: any[]) => {
      const from: string = params[0]
      const to: string = params[1]
      const value: string = params[2]
      const nonce: string = params[3]
      const sig: string = params[4]
    })
  }

  stop = async (): Promise<void> => {

  }
}