import { RpcTask } from '../rpc'
import { ITask, TaskManager } from '../task'
import { TxPoolTask } from '../txpool'
import { NetworkTask } from '../network'
import { SignedTransaction } from '../types'
import { logger } from '../logger'

export class ApiTask implements ITask {
  manager: TaskManager

  name = () => 'api'

  init = async (manager: TaskManager): Promise<void> => {
    this.manager = manager
  }

  start = async (): Promise<void> => {
    const rpc = this.manager.get<RpcTask>('rpc')

    rpc.addMethod('transact', async (params: string[]) => {
      const tx = SignedTransaction.fromBuffer(Buffer.from(params[0], 'hex'))
      if (!await tx.verify()) {
        throw new Error('invalid tx!')
      }
      const txpool = this.manager.get<TxPoolTask>('txpool')
      if (txpool.push(tx)) {
        logger.info(`hash=${tx.toHash().toString('hex')} has added.`)
        const network = this.manager.get<NetworkTask>('network')

        await network.publish(Buffer.from([0]), tx.toBuffer())
      }
    })
  }

  stop = async (): Promise<void> => { }
}