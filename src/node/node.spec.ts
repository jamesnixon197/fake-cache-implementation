import { Node } from "./index";
import { linkTwoNodes } from "../tests/utils";

describe("Node", () => {
  let firstNode: Node<string>;
  let secondNode: Node<string>;
  let thirdNode: Node<string>;

  beforeEach(() => {
    firstNode = new Node(1, "foo");
    secondNode = new Node(2, "bar");
    thirdNode = new Node(3, "baz");
    linkTwoNodes(firstNode, secondNode);
    linkTwoNodes(secondNode, thirdNode);
  });

  describe("detach", () => {
    it("should set the nodes prev & next to undefined", async () => {
      secondNode.detach();

      expect(secondNode).toEqual({
        data: "bar",
        key: 2,
        next: undefined,
        prev: undefined,
      });
    });

    it("should update the previous of the next node", async () => {
      secondNode.detach();

      expect(thirdNode.prev).toStrictEqual(firstNode);
    });

    it("should update the next of the previous node", async () => {
      secondNode.detach();

      expect(firstNode.next).toStrictEqual(thirdNode);
    });
  });
});
