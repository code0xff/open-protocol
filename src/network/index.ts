import { createLibp2p, Libp2p } from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { noise } from '@chainsafe/libp2p-noise'
import { mplex } from '@libp2p/mplex'
import { ITask, TaskManager } from '../task'
import { peerIdFromKeys } from '@libp2p/peer-id'
import { multiaddr } from '@multiformats/multiaddr'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { PeerId } from '@libp2p/interface-peer-id'
import { TxPoolTask } from '../txpool'
import { SignedTransaction } from '../types'
import { logger } from '../logger'

export class NetworkTask implements ITask {
  node: Libp2p
  peerId: PeerId
  manager: TaskManager
  topic: string

  name = () => 'network'

  init = async (manager: TaskManager): Promise<void> => {
    this.manager = manager
    this.topic = 'openprotocol'

    const privateKey = Uint8Array.from(Buffer.from(process.env.PEER_PRIVATE, 'hex'))
    const publicKey = Uint8Array.from(Buffer.from(process.env.PEER_PUBLIC, 'hex'))
    this.peerId = await peerIdFromKeys(publicKey, privateKey)

    const endpoint = process.env.LIBP2P_ENDPOINT
    logger.info(`endpoint: ${endpoint}`)

    this.node = await createLibp2p({
      pubsub: gossipsub(),
      addresses: {
        listen: [endpoint]
      },
      transports: [tcp()],
      connectionEncryption: [noise()],
      streamMuxers: [mplex()],
      peerId: this.peerId
    })
  }

  start = async (): Promise<void> => {
    await this.node.start()

    this.node.getMultiaddrs().forEach((ma) => {
      logger.info(ma.toString())
    })

    const peers = process.env.PEER_ENDPOINTS ? process.env.PEER_ENDPOINTS.split(',') : []
    for (const peer of peers) {
      try {
        await this.node.dial(multiaddr(peer))
        logger.info(`remote peer: ${peer}`)
      } catch (e: any) {
        logger.error(e)
      }
    }

    this.node.pubsub.subscribe(this.topic)
    this.node.pubsub.addEventListener('message', (evt) => {
      const { data } = evt.detail
      const type = data[0]
      if (type === 0) {
        const tx = SignedTransaction.fromBuffer(Buffer.from(data.slice(1)))
        const txpool = this.manager.get<TxPoolTask>('txpool')
        if (!txpool.push(tx)) {
          console.debug(`already added tx! hash=${tx.toHash().toString('hex')}`)
        }
      } else {
        logger.error('unknown type!')
      }
    })

    this.node.connectionManager.addEventListener('peer:connect', (evt) => {
      logger.info(`connected to ${evt.detail.remotePeer.toString()}`)
    })

    this.node.connectionManager.addEventListener('peer:disconnect', (evt) => {
      logger.info(`disconnected to ${evt.detail.remotePeer.toString()}`)
    })
  }

  stop = async (): Promise<void> => {
    await this.node.stop()
  }

  public publish = async (type: Buffer, tx: Buffer): Promise<void> => {
    await this.node.pubsub.publish(this.topic, Buffer.concat([type, tx]))
  }
}
