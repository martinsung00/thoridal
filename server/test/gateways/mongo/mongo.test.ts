import mongoose from "mongoose";
import { Kitten } from "@models";

describe("MongoDBGateway Tests", function () {
  mongoose.connect("localhost/test");
  mongoose.connection.once("open", () => {}).on("error", () => {});

  afterEach(done => {
    mongoose.connection.collections.kittens.drop(() => {
      done();
    });
  });

  describe("write", function () {
    it("should be able to write documents to db", function (done) {
      const cat = new Kitten({
        name: "Pikachu",
        age: 10,
      });

      cat.save().then(() => {
        expect(cat.isNew).toEqual(false);
        done();
      });
    });
  });

  describe("read", function () {
    let cat;

    beforeEach(done => {
      cat = new Kitten({ name: "Pikachu", age: 10 });
      cat.save().then(() => done());
    });

    it("should be able to read documents from db", function (done) {
      Kitten.findOne({ name: "Pikachu", age: 10 }).then(cat => {
        expect(cat).not.toBeNull;

        // To-do: Resolve this type-refinement.
        if (cat == null) throw {};
        const { name, age } = cat as { [key: string]: any };

        expect(name).toEqual("Pikachu");
        expect(age).toEqual(10);
        done();
      });
    });
  });
});
