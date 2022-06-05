import { Node } from "../node";

export class Cache<T> {
  private head?: Node<T> = undefined;
  private tail?: Node<T> = undefined;
  private map: Map<number, Node<T>> = new Map<number, Node<T>>();
  capacity: number;

  constructor(capacity = 3) {
    this.capacity = capacity;
  }

  put(key: number, value: T): void {
    const existingNode = this.map.get(key);

    if (existingNode) {
      const isHeadNode = !existingNode?.prev;
      if (!isHeadNode) this.reinsertNode(existingNode);
      return;
    }

    const mapSize = this.map.size + 1;

    if (mapSize > this.capacity) this.deleteTailNode();

    const newNode = new Node<T>(key, value);

    this.map.set(key, newNode);

    this.addNewNode(newNode);
  }

  update(key: number, value: T): void {
    const existingNode = this.map.get(key);

    if (!existingNode) return;

    const isHeadNode = !existingNode?.prev;

    existingNode.data = value;

    this.map.set(key, existingNode);

    if (!isHeadNode) this.reinsertNode(existingNode);
  }

  get(key: number): T | null {
    const existingNode = this.map.get(key);
    const isHeadNode = !existingNode?.prev;

    if (!existingNode) return null;

    if (!isHeadNode) this.reinsertNode(existingNode);

    return existingNode.data;
  }

  get output(): [number, T][] {
    let currentNode = this.head;
    const cacheOutput: [number, T][] = [];

    while (currentNode) {
      cacheOutput.push([currentNode.key, currentNode.data]);
      currentNode = currentNode.next;
    }

    return cacheOutput;
  }

  private reinsertNode(node: Node<T>) {
    node.detach();
    this.addNewNode(node);
  }

  private deleteTailNode() {
    if (!this.tail) return;
    const currentTail = this.tail;
    this.tail = currentTail.prev;
    this.map.delete(currentTail.key);

    currentTail.detach();
  }

  private addNewNode(node: Node<T>) {
    if (!this.head || !this.tail) {
      this.addFirstNode(node);
      return;
    }

    const previousHead = this.head;
    previousHead.prev = node;

    this.head = node;
    this.head.next = previousHead;
  }

  private addFirstNode(node: Node<T>) {
    this.head = node;
    this.tail = node;
  }
}
