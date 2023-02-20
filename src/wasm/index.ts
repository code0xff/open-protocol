import { RpcTask } from '../rpc/index.js'
import { StateTask } from '../state/index.js'
import { ITask, TaskManager } from '../task/index.js'

export class WasmTask implements ITask {
  manager: TaskManager

  name = () => 'wasm'

  init = async (manager: TaskManager): Promise<void> => {
    this.manager = manager
  }

  start = async (): Promise<void> => {
    const rpc = this.manager.get<RpcTask>('rpc')

    rpc.addMethod('call', async (params: any[]) => {
      await this.call(params[0], params[1], params[2])
    })

    rpc.addMethod('create', async (params: any[]) => {
      await this.create(params[0], params[1])
    })
  }

  stop = async (): Promise<void> => {
    console.log('wasm has stopped')
  }

  create = async (address: string, code: string) => {
    const db = this.manager.get<StateTask>('state')
    await db.put(Buffer.from(address, 'hex'), Buffer.from(code, 'base64url'))
  }

  call = async (address: string, method: string, params: string) => {
    const state = this.manager.get<StateTask>('state')
    const code = await state.get(Buffer.from(address, 'hex'))
    const module = await WebAssembly.instantiate(code, {
      env: {
        log_str: (offset: number, len: number) => {
          const { buffer } = module.instance.exports.memory as WebAssembly.Memory
          const text = new TextDecoder('utf8').decode(Buffer.from(buffer, offset, len))
          console.log(text)
        },
        log_i32: (i: number) => {
          console.log(i)
        },
      }
    })
    const bytes = Buffer.from(params, 'hex')
    const buffer = (module.instance.exports.memory as WebAssembly.Memory).buffer
    new Uint8Array(buffer).subarray().set(bytes);
    (module.instance.exports[method] as any)(buffer, bytes.length)
  }
}