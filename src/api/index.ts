import { encode } from '../codec'
import { KeypairTask } from '../keypair'
import { RpcTask } from '../rpc'
import { ITask, TaskManager } from '../task'
import crypto from 'crypto'
import { TxPoolTask } from '../txpool'
import { NetworkTask } from '../network'

export class ApiTask implements ITask {
  manager: TaskManager

  name = () => 'api'

  init = async (manager: TaskManager): Promise<void> => {
    this.manager = manager
  }

  // transaction
  // params[0] = from
  // params[1] = to
  // params[2] = value
  // params[3] = nonce
  // params[4] = input
  // params[5] = signature

  start = async (): Promise<void> => {
    const rpc = this.manager.get<RpcTask>('rpc')

    rpc.addMethod('transfer', async (params: string[]) => {
      const tx = params.map(param => Buffer.from(param, 'hex'))
      if (!await this.verify(tx)) {
        throw new Error('invalid tx!')
      }
      const txpool = this.manager.get<TxPoolTask>('txpool')
      const hash = txpool.add(tx)
      console.log(`hash=${hash.toString('hex')} has added`)
      const network = this.manager.get<NetworkTask>('network')
      
      await network.publish(Buffer.from([0]), encode(tx))
    })
  }

  stop = async (): Promise<void> => { 
    console.log('api has stopped')
  }

  verify = async (tx: Buffer[]): Promise<boolean> => {
    const message = encode(tx.slice(0, 5))
    const sha256ed = crypto.createHash('sha256').update(message).digest()
    const keypair = this.manager.get<KeypairTask>('keypair')
    return keypair.verify(tx[5], sha256ed, tx[0])
  }
}