import Computer from "./Computer";

export default class Cluster {
  // TODO: something to assist with setting up links between input/output pairs
  constructor(public computers: Computer[]) {}

  runAll() {
    this.computers.forEach(computer => computer.run());
  }

  get allTerminated() {
      return this.computers
        .map(computer => computer.status)
        .every(status => status === 'terminated');
  }

  async awaitAllTerminated() {
    return new Promise<void>((resolve, _reject) => {
      const waiting = setInterval(() => {
        if (this.allTerminated) {
          clearInterval(waiting);
          resolve();
        }
      }, 0);
    });
  }
}