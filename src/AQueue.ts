export default abstract  class AQueue<T> {
    queue: T[] = [];
    addEletement(el: T, cackback?: () => {}) {
        this.queue.push(el);
    };
    getElement(): T | undefined {
        return this.queue.shift()
    }
}