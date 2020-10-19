import { PostgresGateway } from "./../../../../src/server/gateways";

describe("Postgres Gateway Tests", function () {
  const db = new PostgresGateway();
  const kitten = {
    id: "abcd",
    name: "sphinx-of-egypt",
    age: 999,
  };

  describe("Write Actions", function () {
    afterAll(async function () {
      // To-do: You will need to empty your tables between tests.
    });

    it("should be able to write a document to db", async function () {
      const result = await db.write(kitten);

      expect(result).toEqual(kitten.id);
    });
  });

  describe("Read Actions", function () {
    it("should be able to fetch a document by id", async function () {
      const id = await db.write(kitten);

      const result = await db.read(id);

      expect(result).toEqual(kitten);
    });
  });
});
