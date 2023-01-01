import Fastify, { FastifyInstance } from 'fastify'
import { JSONRPCServer, JSONRPCRequest, SimpleJSONRPCMethod } from 'json-rpc-2.0'
import { ITask, TaskManager } from '../task'

export class RPC implements ITask {
  fastify: FastifyInstance
  server: JSONRPCServer
  manager: TaskManager

  name = () => 'rpc'

  init = async (manager: TaskManager): Promise<void> => {
    this.manager = manager

    this.fastify = Fastify()
    this.server = new JSONRPCServer()

    this.fastify.get('/health', async () => {
      return 'node is alive!!!'
    })

    this.fastify.post('/jsonrpc', async (request, reply) => {
      const _request = request.body as JSONRPCRequest
      const _response = await this.server.receive(_request)

      if (_response) {
        reply.send(_response)
      } else {
        reply.status(204)
        reply.send()
      }
    })
  }

  start = async (): Promise<void> => {
    const port = process.env.RPC_PORT ? parseInt(process.env.RPC_PORT) : 9999
    await this.fastify.listen({ port })
    console.log(`server listen on ${port}!`)
  }

  stop = async (): Promise<void> => {
    await this.fastify.close()
    console.log('rpc has closed')
  }

  addMethod = (name: string, method: SimpleJSONRPCMethod) => {
    this.server.addMethod(name, method)
  }
}
