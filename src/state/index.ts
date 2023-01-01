import { Trie } from '@ethereumjs/trie';
import { Level } from 'level';
import { ITask, TaskManager } from '../task';
import { LevelDB } from './level';

export class State implements ITask {
  manager: TaskManager
  trie: Trie

  name = () => 'state'

  init = async (manager: TaskManager): Promise<void> => {
    this.manager = manager
    this.trie = await Trie.create({db: new LevelDB(new Level('./db')), useRootPersistence: true})
  }

  start = async (): Promise<void> => { }

  stop = async (): Promise<void> => { }

  put = async (key: Buffer, value: Buffer): Promise<void> => {
    await this.trie.put(key, value)
  }

  get = async (key: Buffer): Promise<Buffer> => {
    return await this.trie.get(key)
  }

  del = async (key: Buffer): Promise<void> => {
    await this.trie.del(key)
  }
}