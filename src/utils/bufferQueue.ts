/**
 * @description: 缓冲队列
 * @param {length} 队列最大长度
 * @param {interval} 间隔时间
 *
 */

import eventBus from './eventBus'

export default class BufferQueue {
  length: number
  interval: number
  timer: any
  queue: Array<any>

  constructor(length: number, interval: number) {
    this.length = length
    this.interval = interval
    this.timer = null
    this.queue = []
  }

  push(data: any) {
    if (this.queue.length < this.length) {
      this.queue.push(data)
      if (this.queue.length === 1) {
        this.startTimer()
      }
    }
  }

  pop() {
    if (this.queue.length) {
      const data = this.queue.shift()
      if (this.queue.length === 0) {
        this.stopTimer()
      }
      eventBus.emit('pop', data)
    }
  }

  filter(canSave: any) {
    return this.queue.filter((data) => canSave(data))
  }

  listenPop(callback: any) {
    eventBus.on('pop', callback)
  }

  clear(callback: any) {
    eventBus.off('pop', callback)
    this.queue = []
    this.stopTimer()
  }

  startTimer() {
    // 立即执行一下
    this.pop()
    this.timer = setInterval(this.pop, this.interval)
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}
