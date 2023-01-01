import { RPC } from "../rpc";
import { State } from "../state";
import { ITask, TaskManager } from "../task";

export class Wasm implements ITask {
  manager: TaskManager

  name = () => 'wasm'

  init = async (manager: TaskManager): Promise<void> => {
    this.manager = manager
  }

  start = async (): Promise<void> => { 
    const rpc = this.manager.get<RPC>('rpc')

    rpc.addMethod('call', async (params: any[]) => {
      await this.call(params[0], params[1], params[2])
    })

    rpc.addMethod('create', async (params: any[]) => {
      await this.create(params[0], params[1])
    })
  }

  stop = async (): Promise<void> => { }

  create = async (address: string, code: string) => {
    const db = this.manager.get<State>('state')
    await db.put(Buffer.from(address, 'hex'), Buffer.from(code, 'hex'))
  }

  call = async (address: string, method: string, params: string) => {
    const state = this.manager.get<State>('state')
    const code = await state.get(Buffer.from(address, 'hex'))
    const module = await WebAssembly.instantiate(code, {
      env: {
        log: console.log
      }
    })
    if (params) {
      const _params = new Uint8Array(Buffer.from(params, 'hex'));
      (module.instance.exports[method] as any)(_params)
    } else {
      (module.instance.exports[method] as any)()
    }
  }
}