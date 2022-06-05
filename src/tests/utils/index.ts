import { Node } from "src/node";

export const linkTwoNodes = <T>(firstNode: Node<T>, secondNode: Node<T>) => {
  firstNode.next = secondNode;
  secondNode.prev = firstNode;
};
