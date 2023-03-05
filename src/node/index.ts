import { Command } from 'commander'
import fs, { readFileSync } from 'fs'
import { RpcTask } from '../rpc'
import { NetworkTask } from '../network'
import { TaskManager } from '../task'
import { createEd25519PeerId } from '@libp2p/peer-id-factory'
import env from 'dotenv'
import { WasmTask } from '../wasm'
import { StateTask } from '../state'
import { Keypair } from '../keypair'
import { TxPoolTask } from '../txpool'
import { ApiTask } from '../api'
import { ConsensusTask } from '../consensus'
import { UnsignedTransaction } from '../types'
import { logger } from '../logger'

env.config()

const program = new Command()
program.command('key')
  .action(async () => {
    const { privateKey, publicKey } = await Keypair.new()
    const wallet = { privateKey, publicKey }
    logger.info(wallet)
    fs.writeFileSync(`key-${new Date().getTime()}.json`, JSON.stringify(wallet, null, '\t'))
  })

program.command('sign')
  .requiredOption('-f, --file-path <file>', 'wallet file path')
  .requiredOption('-m, --message <message>', 'hex encoded message')
  .action(async (options) => {
    const loaded = fs.readFileSync(options.filePath, 'utf8')
    const wallet = JSON.parse(loaded)
    if (wallet.privateKey) {
      const privateKey = Buffer.from(wallet.privateKey, 'hex')
      const mesasge = Buffer.from(options.message, 'hex')
      const signature = (await Keypair.sign(privateKey, mesasge)).toString('hex')
      logger.info(signature)
      fs.writeFileSync(`signature-${new Date().getTime()}.txt`, signature)
    } else {
      logger.error('invalid wallet format!')
    }
  })

program.command('peerkey')
  .action(async () => {
    const peerId = await createEd25519PeerId()
    const privateKey = Buffer.from(peerId.privateKey).toString('hex')
    const publicKey = Buffer.from(peerId.publicKey).toString('hex')
    const keypair = { privateKey, publicKey, peerId: peerId.toString() }
    logger.info(keypair)
    fs.writeFileSync(`peerkey-${new Date().getTime()}.json`, JSON.stringify(keypair, null, '\t'))
  })

program.command('node')
  .action(async () => {
    const manager = new TaskManager()
    manager.add(new TxPoolTask())
    manager.add(new RpcTask())
    manager.add(new StateTask())
    manager.add(new NetworkTask())
    manager.add(new WasmTask())
    manager.add(new ApiTask())
    manager.add(new ConsensusTask())

    await manager.initialize()
    await manager.start()

    process.on('SIGINT', manager.stop)
    process.on('SIGTERM', manager.stop)
  })

program.command('wasm')
  .requiredOption('-f, --file-path <file>', 'file path')
  .action((options) => {
    const path = options.filePath
    const buffer = readFileSync(path)
    const compiled = buffer.toString('hex')
    fs.writeFileSync(`contract-${new Date().getTime()}.txt`, compiled)
  })

program.command('encode')
  .requiredOption('-t, --transaction <transaction>', 'encode transaction')
  .action(async (options) => {
    try {
      const tx = UnsignedTransaction.fromJson(options.transaction)
      const transaction = { hash: tx.toHash().toString('hex'), data: tx.toBuffer().toString('hex') }
      logger.info(transaction)
      fs.writeFileSync(`transaction-${new Date().getTime()}.txt`, JSON.stringify(transaction, null, '\t'))
    } catch (e: any) {
      logger.error(e.message)
    }
  })

program.parse(process.argv)
