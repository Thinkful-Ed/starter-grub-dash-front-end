const request = require("supertest");
const dishes = require("../src/data/dishes-data");
const dishesRouter = require("../src/dishes/dishes.router");
const makeTestApp = require("./make-test-app");

const ATTACHED_PATH = "/dishes-router";

const app = makeTestApp(ATTACHED_PATH, dishesRouter);

describe("dishes router", () => {
  beforeEach(() => {
    dishes.splice(0, dishes.length);
  });

  describe("create method", () => {
    test("creates a new dish and assigns id", async () => {
      const expectedName = "creates a new dish and assigns id";
      const response = await request(app)
        .post(ATTACHED_PATH)
        .set("Accept", "application/json")
        .send({
          data: {
            name: expectedName,
            description: "description",
            image_url: "none",
            price: 1,
          },
        });

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).not.toBeUndefined();
      expect(response.body.data.id).not.toBeUndefined();
      expect(response.body.data.name).toEqual(expectedName);
      expect(response.status).toBe(201);
      expect(dishes.find(dish => dish.name === expectedName)).not.toBeUndefined();
    });

    test("returns 400 if name is missing", async () => {
      const response = await request(app)
        .post(ATTACHED_PATH)
        .set("Accept", "application/json")
        .send({
          data: { description: "description", image_url: "none", price: 1 },
        });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("name");
      expect(response.status).toBe(400);
    });

    test("returns 400 if name is empty", async () => {
      const response = await request(app)
        .post(ATTACHED_PATH)
        .set("Accept", "application/json")
        .send({
          data: {
            name: "",
            description: "description",
            image_url: "none",
            price: 1,
          },
        });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("name");
      expect(response.status).toBe(400);
    });

    test("returns 400 if description is missing", async () => {
      const response = await request(app)
        .post(ATTACHED_PATH)
        .set("Accept", "application/json")
        .send({ data: { name: "name", image_url: "none", price: 1 } });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("description");
      expect(response.status).toBe(400);
    });

    test("returns 400 if image_url is missing", async () => {
      const response = await request(app)
        .post(ATTACHED_PATH)
        .set("Accept", "application/json")
        .send({ data: { name: "name", description: "description", price: 1 } });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("image_url");
      expect(response.status).toBe(400);
    });
    test("returns 400 if image_url is empty", async () => {
      const response = await request(app)
        .post(ATTACHED_PATH)
        .set("Accept", "application/json")
        .send({
          data: {
            name: "name",
            description: "description",
            image_url: "",
            price: 1,
          },
        });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("image_url");
      expect(response.status).toBe(400);
    });

    test("returns 400 if price is missing", async () => {
      const response = await request(app)
        .post(ATTACHED_PATH)
        .set("Accept", "application/json")
        .send({
          data: { name: "name", description: "description", image_url: "none" },
        });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("price");
      expect(response.status).toBe(400);
    });

    test("returns 400 if price is zero", async () => {
      const response = await request(app)
        .post(ATTACHED_PATH)
        .set("Accept", "application/json")
        .send({ data: { name: "name", description: "description", price: 0, image_url: "none" } });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("price");
      expect(response.status).toBe(400);
    });

    test("returns 400 if price is less than zero", async () => {
      const response = await request(app)
        .post(ATTACHED_PATH)
        .set("Accept", "application/json")
        .send({
          data: { name: "name", description: "description", price: Number.MIN_SAFE_INTEGER, image_url: "none" },
        });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("price");
      expect(response.status).toBe(400);
    });
  });

  describe("read method", () => {
    test("returns an existing dish", async () => {
      const expected = {
        id: "42",
        name: "Fried Spam",
        description: "America’s favorite mystery meat in a can.",
        price: 42,
      };

      dishes.push(expected);

      const response = await request(app)
        .get(`${ATTACHED_PATH}/42`)
        .set("Accept", "application/json");

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toEqual(expected);
      expect(response.status).toBe(200);
    });

    test("returns 404 for non-existent dish", async () => {
      const response = await request(app)
        .get(`${ATTACHED_PATH}/77`)
        .set("Accept", "application/json");

      expect(response.body.error).not.toBeUndefined();
      expect(response.status).toEqual(404);
    });
  });

  describe("update method", () => {
    test("returns 404 if dish does not exist", async () => {
      const data = {
        id: "9",
        name: "Fried Spam",
        description: "America’s favorite mystery meat in a can.",
        price: 9,
      };

      const response = await request(app)
        .put(`${ATTACHED_PATH}/13`)
        .set("Accept", "application/json")
        .send({ data });

      expect(response.body.error).not.toBeUndefined();
      expect(response.status).toBe(404);
    });

    test("updates the dish", async () => {
      const original = {
        id: "14",
        name: "Fried Spam",
        description: "America’s favorite mystery meat in a can.",
        image_url: "some-valid-url",
        price: 14,
      };

      dishes.push(original);

      const expected = {
        id: "14",
        name: "Coddled Eggs",
        description: "lightly steamed in a hot water bath.",
        image_url: "some-valid-url",
        price: 14,
      };

      const response = await request(app)
        .put(`${ATTACHED_PATH}/14`)
        .set("Accept", "application/json")
        .send({ data: expected });

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toEqual(expected);
      expect(response.status).toBe(200);
    });

    test("returns 400 if data.id does not match :dishId in the route", async () => {
      const original = {
        id: "14",
        name: "Fried Spam",
        description: "America’s favorite mystery meat in a can.",
        image_url: "some-valid-url",
        price: 14,
      };

      dishes.push(original);

      const expected = {
        id: "19",
        name: "Coddled Eggs",
        description: "lightly steamed in a hot water bath.",
        image_url: "some-valid-url",
        price: 14,
      };

      const response = await request(app)
        .put(`${ATTACHED_PATH}/14`)
        .set("Accept", "application/json")
        .send({
          data: expected,
        });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("id");
      expect(response.body.error).toContain("19");
      expect(response.status).toBe(400);
    });

    test("updates the dish if data.id is missing, even though it does not match :dishId in the route", async () => {
      const original = {
        id: "14",
        name: "Fried Spam",
        description: "America’s favorite mystery meat in a can.",
        image_url: "some-valid-url",
        price: 14,
      };

      dishes.push(original);

      const expected = {
        name: "Coddled Eggs",
        description: "lightly steamed in a hot water bath.",
        image_url: "some-valid-url",
        price: 14,
      };

      const response = await request(app)
        .put(`${ATTACHED_PATH}/14`)
        .set("Accept", "application/json")
        .send({
          data: expected,
        });

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toEqual({ ...expected, id: original.id });
      expect(response.status).toBe(200);
    });

    test("updates the dish if data.id is empty, even though it does not match :dishId in the route", async () => {
      const original = {
        id: "14",
        name: "Fried Spam",
        description: "America’s favorite mystery meat in a can.",
        image_url: "some-valid-url",
        price: 14,
      };

      dishes.push(original);

      const expected = {
        id: "",
        name: "Coddled Eggs",
        description: "lightly steamed in a hot water bath.",
        image_url: "some-valid-url",
        price: 14,
      };

      const response = await request(app)
        .put(`${ATTACHED_PATH}/14`)
        .set("Accept", "application/json")
        .send({
          data: expected,
        });

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toEqual({ ...expected, id: original.id });
      expect(response.status).toBe(200);
    });

    test("updates the dish if data.id is null, even though it does not match :dishId in the route", async () => {
      const original = {
        id: "14",
        name: "Fried Spam",
        description: "America’s favorite mystery meat in a can.",
        image_url: "some-valid-url",
        price: 14,
      };

      dishes.push(original);

      const expected = {
        id: null,
        name: "Coddled Eggs",
        description: "lightly steamed in a hot water bath.",
        image_url: "some-valid-url",
        price: 14,
      };

      const response = await request(app)
        .put(`${ATTACHED_PATH}/14`)
        .set("Accept", "application/json")
        .send({
          data: expected,
        });

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toEqual({ ...expected, id: original.id });
      expect(response.status).toBe(200);
    });

    test("updates the dish if data.id is undefined, even though it does not match :dishId in the route", async () => {
      const original = {
        id: "14",
        name: "Fried Spam",
        description: "America’s favorite mystery meat in a can.",
        image_url: "some-valid-url",
        price: 14,
      };

      dishes.push(original);

      const expected = {
        id: undefined,
        name: "Coddled Eggs",
        description: "lightly steamed in a hot water bath.",
        image_url: "some-valid-url",
        price: 14,
      };

      const response = await request(app)
        .put(`${ATTACHED_PATH}/14`)
        .set("Accept", "application/json")
        .send({
          data: expected,
        });

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toEqual({ ...expected, id: original.id });
      expect(response.status).toBe(200);
    });

    test("returns 400 if name is missing", async () => {
      const original = {
        id: "15",
        name: "Bubble & Squeak",
        description: "Fried leftover veggies",
        price: 15,
      };

      dishes.push(original);

      const { name, ...data } = original;

      const response = await request(app)
        .put(`${ATTACHED_PATH}/15`)
        .set("Accept", "application/json")
        .send({
          data,
        });
      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("name");
      expect(response.status).toBe(400);
    });

    test("returns 400 if name is empty", async () => {
      const original = {
        id: "16",
        name: "The Imam Fainted",
        description: "Whole eggplant, garlic, and tomatoes.",
        price: 16,
      };

      dishes.push(original);

      const response = await request(app)
        .put(`${ATTACHED_PATH}/16`)
        .set("Accept", "application/json")
        .send({
          data: { ...original, name: "" },
        });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("name");
      expect(response.status).toBe(400);
    });

    test("returns 400 if description is missing", async () => {
      const original = {
        id: "17",
        name: "Century Eggs",
        description: "Whole eggs preserved in clay and ash for a few months",
        price: 17,
      };

      dishes.push(original);

      const { description, ...data } = original;

      const response = await request(app)
        .put(`${ATTACHED_PATH}/17`)
        .set("Accept", "application/json")
        .send({ data });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("description");
      expect(response.status).toBe(400);
    });

    test("returns 400 if description is empty", async () => {
      const original = {
        id: "17",
        name: "Century Eggs",
        description: "Whole eggs preserved in clay and ash for a few months",
        price: 17,
      };

      dishes.push(original);

      const response = await request(app)
        .put(`${ATTACHED_PATH}/17`)
        .set("Accept", "application/json")
        .send({ data: { ...original, description: "" } });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("description");
      expect(response.status).toBe(400);
    });

    test("returns 400 if image_url is missing", async () => {
      const original = {
        id: "17",
        name: "Century Eggs",
        description: "Whole eggs preserved in clay and ash for a few months",
        image_url: "some-valid-url",
        price: 17,
      };

      dishes.push(original);

      const { image_url, ...data } = original;

      const response = await request(app)
        .put(`${ATTACHED_PATH}/17`)
        .set("Accept", "application/json")
        .send({ data });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("image_url");
      expect(response.status).toBe(400);
    });

    test("returns 400 if image_url is empty", async () => {
      const original = {
        id: "17",
        name: "Century Eggs",
        description: "Whole eggs preserved in clay and ash for a few months",
        image_url: "some-valid-url",
        price: 17,
      };

      dishes.push(original);

      const response = await request(app)
        .put(`${ATTACHED_PATH}/17`)
        .set("Accept", "application/json")
        .send({ data: { ...original, image_url: "" } });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("image_url");
      expect(response.status).toBe(400);
    });

    test("returns 400 if price is missing", async () => {
      const original = {
        id: "17",
        name: "Century Eggs",
        description: "Whole eggs preserved in clay and ash for a few months",
        image_url: "some-valid-url",
        price: 17,
      };

      dishes.push(original);

      const { price, ...data } = original;

      const response = await request(app)
        .put(`${ATTACHED_PATH}/17`)
        .set("Accept", "application/json")
        .send({ data });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("price");
      expect(response.status).toBe(400);
    });

    test("returns 400 if price is not a number", async () => {
      const original = {
        id: "17",
        name: "Century Eggs",
        description: "Whole eggs preserved in clay and ash for a few months",
        image_url: "some-valid-url",
        price: "17",
      };

      dishes.push(original);

      const response = await request(app)
        .put(`${ATTACHED_PATH}/17`)
        .set("Accept", "application/json")
        .send({ data: { ...original } });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("price");
      expect(response.status).toBe(400);
    });

    test("returns 400 if price is zero", async () => {
      const original = {
        id: "17",
        name: "Century Eggs",
        description: "Whole eggs preserved in clay and ash for a few months",
        image_url: "some-valid-url",
        price: 17,
      };

      dishes.push(original);

      const response = await request(app)
        .put(`${ATTACHED_PATH}/17`)
        .set("Accept", "application/json")
        .send({ data: { ...original, price: 0 } });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("price");
      expect(response.status).toBe(400);
    });

    test("returns 400 if price is less than zero", async () => {
      const original = {
        id: "17",
        name: "Century Eggs",
        description: "Whole eggs preserved in clay and ash for a few months",
        image_url: "some-valid-url",
        price: 17,
      };

      dishes.push(original);

      const response = await request(app)
        .put(`${ATTACHED_PATH}/17`)
        .set("Accept", "application/json")
        .send({ data: { ...original, price: Number.MIN_SAFE_INTEGER } });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("price");
      expect(response.status).toBe(400);
    });
  });

  describe("delete method", () => {
    test("returns 405 for existing dish", async () => {
      const original = {
        id: "18",
        name: "Bangers And Mash",
        description:
          "finger sausages alongside a pile of mashed potatoes drizzled with gravy.",
        price: 18,
      };

      dishes.push(original);

      const response = await request(app)
        .delete(`${ATTACHED_PATH}/18`)
        .set("Accept", "application/json");

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).not.toBeUndefined();
      expect(response.status).toBe(405);
    });
  
    test("returns 405 for non-existent dish", async () => {
      const response = await request(app)
        .delete(`${ATTACHED_PATH}/77`)
        .set("Accept", "application/json");

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).not.toBeUndefined();
      expect(response.status).toBe(405);
    });
  });

  describe("list method", () => {
    test("returns list of dishes", async () => {
      const expected = [
        {
          id: "20",
          name: "Witchetty Grub",
          description: "The larva of a moth that feeds on the Witchetty bush",
          price: 20,
        },
        {
          id: "21",
          name: "Clootie Dumpling",
          description:
            "A dessert pudding made of sweet stuff, like dough, dried fruits, and sugar",
          price: 21,
        },
      ];

      dishes.push(...expected);

      const response = await request(app)
        .get(ATTACHED_PATH)
        .set("Accept", "application/json");

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toEqual(expected);
      expect(response.status).toBe(200);
    });
  });
});
