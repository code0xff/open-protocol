import { Command } from 'commander'
import fs, { readFileSync } from 'fs'
import { RPC } from '../rpc'
import { Network } from '../network'
import { TaskManager } from '../task'
import { createEd25519PeerId } from '@libp2p/peer-id-factory'
import env from 'dotenv'
import { ed25519PairFromRandom } from '@polkadot/util-crypto'
import { Wasm } from '../wasm'
import { State } from '../state'

env.config()

const program = new Command()
program.command('wallet')
  .action(async () => {
    const keypair = ed25519PairFromRandom()
    const privateKey = Buffer.from(keypair.secretKey).toString('hex')
    const publicKey = Buffer.from(keypair.publicKey).toString('hex')
    fs.writeFileSync(`wallet-${new Date().getTime()}.json`, JSON.stringify({privateKey, publicKey}, null, '\t'))
  })

program.command('peerkey')
  .action(async () => {
    const peerId = await createEd25519PeerId()
    const privateKey = Buffer.from(peerId.privateKey).toString('hex')
    const publicKey = Buffer.from(peerId.publicKey).toString('hex')
    const keypair = {privateKey, publicKey, peerId: peerId.toString()}
    console.log(keypair)
    fs.writeFileSync(`peerkey-${new Date().getTime()}.json`, JSON.stringify(keypair, null, '\t'))
  })

program.command('node')
  .action(async () => {
    const manager = new TaskManager()
    manager.add(new RPC())
    manager.add(new State())
    manager.add(new Network())
    manager.add(new Wasm())

    await manager.initialize()
    await manager.start()

    process.on('SIGINT', manager.stop)
    process.on('SIGTERM', manager.stop)
  })

program.command('wasm')
  .option('-f, --file-path <file>', 'file path')
  .action((options) => {
    const path = options.filePath
    const buffer = readFileSync(path)
    const compiled = buffer.toString('hex')
    fs.writeFileSync(`contract-${new Date().getTime()}.txt`, compiled)
  })

program.parse(process.argv)
