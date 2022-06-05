import { Node } from "../node";
import { Cache } from ".";
import { linkTwoNodes } from "../tests/utils";

describe("Cache", () => {
  let cache: Cache<string>;
  let cacheMapGetSpy: jest.SpyInstance;
  let cacheMapSetSpy: jest.SpyInstance;
  let cacheMapDeleteSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    cache = new Cache(2);
    cacheMapGetSpy = jest.spyOn(Map.prototype, "get");
    cacheMapSetSpy = jest.spyOn(Map.prototype, "set");
    cacheMapDeleteSpy = jest.spyOn(Map.prototype, "delete");
  });

  describe("Put", () => {
    describe("Single item put on cache", () => {
      it("should set the data on the cache", async () => {
        cache.put(1, "foo");

        expect(cache.output).toStrictEqual([[1, "foo"]]);
      });

      it("should set the item on the cache map", async () => {
        cache.put(1, "foo");

        expect(cacheMapSetSpy).toHaveBeenCalledWith(1, {
          data: "foo",
          key: 1,
          next: undefined,
          prev: undefined,
        });
      });
    });

    describe("Attempted to put an item with the same key on the cache", () => {
      it("should set the data on the cache", async () => {
        cache.put(1, "foo");
        cache.put(1, "foo");

        expect(cache.output).toStrictEqual([[1, "foo"]]);
      });

      it("should set the item on the cache map", async () => {
        cache.put(1, "foo");
        cache.put(1, "foo");

        expect(cacheMapSetSpy).toBeCalledTimes(1);
        expect(cacheMapSetSpy).toHaveBeenCalledWith(1, {
          data: "foo",
          key: 1,
          next: undefined,
          prev: undefined,
        });
      });
    });

    describe("Item with a different key put on cache twice", () => {
      let expectedFooNode: Node<string>;
      let expectedBarNode: Node<string>;
      beforeEach(() => {
        expectedFooNode = new Node(1, "foo");
        expectedBarNode = new Node(2, "bar");

        linkTwoNodes(expectedBarNode, expectedFooNode);
      });

      it("should set the data on the cache", async () => {
        cache.put(1, "foo");
        cache.put(2, "bar");

        expect(cache.output).toStrictEqual([
          [2, "bar"],
          [1, "foo"],
        ]);
      });

      it("should set both items on the cache map", async () => {
        cache.put(1, "foo");
        cache.put(2, "bar");

        expect(cacheMapSetSpy).toHaveBeenNthCalledWith(1, 1, expectedFooNode);
        expect(cacheMapSetSpy).toHaveBeenNthCalledWith(2, 2, expectedBarNode);
      });
    });

    describe("Cache capacity exceeded", () => {
      it("should remove the least recently used cache item", async () => {
        cache.put(1, "foo");
        cache.put(2, "bar");
        cache.put(3, "bar");

        expect(cacheMapDeleteSpy).toHaveBeenCalledWith(1);
      });

      it("should only keep the most recent used cache items on cache", async () => {
        cache.put(1, "foo");
        cache.put(2, "bar");
        cache.put(3, "bar");

        expect(cache.output).toStrictEqual([
          [3, "bar"],
          [2, "bar"],
        ]);
      });
    });
  });

  describe("Get", () => {
    describe("Nothing on cache", () => {
      it("should return null", async () => {
        expect(cache.get(1)).toBeNull();
      });
    });

    describe("Single item on cache", () => {
      it("should return the data associated with the key", async () => {
        cache.put(1, "foo");

        expect(cache.get(1)).toBe("foo");
      });
    });

    describe("Multiple items on cache", () => {
      it("should return the data associated with the key", async () => {
        cache.put(1, "foo");
        cache.put(2, "bar");

        expect(cache.get(1)).toBe("foo");
      });

      it("should put the accessed cache node to front of list", async () => {
        cache.put(1, "foo");
        cache.put(2, "bar");

        expect(cache.output).toStrictEqual([
          [2, "bar"],
          [1, "foo"],
        ]);

        cache.get(1);

        expect(cache.output).toStrictEqual([
          [1, "foo"],
          [2, "bar"],
        ]);
      });
    });
  });

  describe("Update", () => {
    describe("Key not found", () => {
      it("should attempt to lookup the key", async () => {
        cache.update(1, "bar");

        expect(cacheMapGetSpy).toHaveBeenCalledWith(1);
      });

      it("should not set the new value on cache map", async () => {
        cache.update(1, "bar");

        expect(cacheMapSetSpy).not.toHaveBeenCalled();
      });
    });

    describe("Key found on cache", () => {
      let expectedBarNode: Node<string>;
      let expectedFooNode: Node<string>;

      beforeEach(() => {
        expectedBarNode = new Node(2, "bar");
        expectedFooNode = new Node(1, "foo");

        linkTwoNodes(expectedFooNode, expectedBarNode);

        cache.put(1, "foo");
        cache.put(2, "bar");

        jest.clearAllMocks();
      });

      it("should set the new value on cache map", async () => {
        cache.update(1, "bar");

        expectedFooNode.data = "bar";

        expect(cacheMapSetSpy).toHaveBeenCalledWith(1, expectedFooNode);
      });

      it("should put the accessed cache node to front of list", async () => {
        cache.update(1, "bar");

        expect(cache.output).toStrictEqual([
          [1, "bar"],
          [2, "bar"],
        ]);
      });
    });
  });
});
