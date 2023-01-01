import { MemoryLevel } from 'memory-level'

const ENCODING_OPTS = { keyEncoding: 'buffer', valueEncoding: 'buffer' }

export class LevelDB {
  _leveldb

  constructor(leveldb) {
    this._leveldb = leveldb ?? new MemoryLevel(ENCODING_OPTS)
  }

  get = async (key: Buffer): Promise<Buffer> => {
    let value = null
    try {
      value = await this._leveldb.get(key, ENCODING_OPTS)
    } catch (error) {
      if (error.notFound !== true) {
        throw error
      }
    }
    return value
  }

  put = async (key: Buffer, val: Buffer): Promise<void> => {
    await this._leveldb.put(key, val, ENCODING_OPTS)
  }

  del = async (key: Buffer): Promise<void> => {
    await this._leveldb.del(key, ENCODING_OPTS)
  }

  async batch(opStack) {
    await this._leveldb.batch(opStack, ENCODING_OPTS)
  }

  copy() {
    return new LevelDB(this._leveldb)
  }
}
