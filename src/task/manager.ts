import { ITask } from "./task"

export class TaskManager {
  tasks: Map<string, ITask>

  constructor() {
    this.tasks = new Map<string, ITask>()
  }

  add = (task: ITask) => {
    this.tasks.set(task.name(), task)
  }

  initialize = async () => {
    await Promise.all([...this.tasks].map(([_, task]) => task.init(this)))
  }

  start = async () => {
    await Promise.all([...this.tasks].map(([_, task]) => task.start()))
  }

  stop = async () => {
    await Promise.all([...this.tasks].map(([_, task]) => task.stop()))
    process.exit(0)
  }

  get = <T extends ITask>(name: string): T => {
    return this.tasks.get(name) as T
  }
}