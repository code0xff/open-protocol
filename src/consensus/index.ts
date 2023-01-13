import { ITask, TaskManager } from '../task'

export class ConsensusTask implements ITask {
  manager: TaskManager

  name = () => 'consensus'

  init = async (manager: TaskManager): Promise<void> => { }

  start = async (): Promise<void> => { }

  stop = async (): Promise<void> => {
    console.log('consensus has stopped')
  }

  isMyTurn = async (): Promise<boolean> => {
    return true
  }
}