export class Node<T> {
  key: number;
  data: T;
  next?: Node<T> = undefined;
  prev?: Node<T> = undefined;

  constructor(key: number, data: T) {
    this.key = key;
    this.data = data;
  }

  detach() {
    const previousNode = this.prev;
    const nextNode = this.next;

    this.next = undefined;
    this.prev = undefined;

    if (nextNode) nextNode.prev = previousNode;
    if (previousNode) previousNode.next = nextNode;
  }
}
