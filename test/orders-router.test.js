const request = require("supertest");
const orders = require("../src/data/orders-data");
const ordersRouter = require("../src/orders/orders.router");
const makeTestApp = require("./make-test-app");

const ATTACHED_PATH = "/orders-router";

const app = makeTestApp(ATTACHED_PATH, ordersRouter);

const validOrder = {
  id: "f6069a542257054114138301947672ba",
  deliverTo: "1600 Pennsylvania Avenue NW, Washington, DC 20500",
  mobileNumber: "(202) 456-1111",
  status: "pending",
  dishes: [
    {
      id: "9",
      name: "Falafel and tahini bagel",
      description: "A warm bagel filled with falafel and tahini",
      image_url: "some-valid-url",
      price: 6,
      quantity: 1,
    },
  ],
};

describe("orders router", () => {
  beforeEach(() => {
    orders.splice(0, orders.length);
  });

  describe("create method", () => {
    test("creates a new order and assigns id", async () => {
      const expectedDeliverTo = "creates a new order and assigns id";
      const response = await request(app)
        .post(ATTACHED_PATH)
        .set("Accept", "application/json")
        .send({
          data: {
            deliverTo: expectedDeliverTo,
            mobileNumber: "(202) 456-1111",
            dishes: [
              {
                id: "9",
                name: "Falafel and tahini bagel",
                description: "A warm bagel filled with falafel and tahini",
                image_url: "some-valid-url",
                status: "pending",
                price: 6,
                quantity: 1,
              },
            ],
          },
        });

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).not.toBeUndefined();
      expect(response.body.data.id).not.toBeUndefined();
      expect(response.body.data.deliverTo).toEqual(expectedDeliverTo);
      expect(response.status).toBe(201);
      expect(orders.find(order => order.deliverTo === expectedDeliverTo)).not.toBeUndefined();
    });

    test("returns 400 if deliverTo is missing", async () => {
      const expected = "deliverTo";
      const data = { ...validOrder };
      delete data.id;
      delete data[expected];

      const response = await request(app)
        .post(ATTACHED_PATH)
        .set("Accept", "application/json")
        .send({
          data,
        });

      expect(response.body.data).toBeUndefined();

      expect(response.body.error).toContain(expected);
      expect(response.status).toBe(400);
    });

    test("returns 400 if deliverTo is empty", async () => {
      const expected = "deliverTo";
      const data = { ...validOrder, [expected]: "" };
      delete data.id;

      const response = await request(app)
        .post(ATTACHED_PATH)
        .set("Accept", "application/json")
        .send({
          data,
        });

      expect(response.body.data).toBeUndefined();

      expect(response.body.error).toContain(expected);
      expect(response.status).toBe(400);
    });

    test("returns 400 if mobileNumber is missing", async () => {
      const expected = "mobileNumber";
      const data = { ...validOrder };
      delete data.id;
      delete data[expected];

      const response = await request(app)
        .post(ATTACHED_PATH)
        .set("Accept", "application/json")
        .send({
          data,
        });

      expect(response.body.data).toBeUndefined();

      expect(response.body.error).toContain(expected);
      expect(response.status).toBe(400);
    });

    test("returns 400 if mobileNumber is empty", async () => {
      const expected = "mobileNumber";
      const data = { ...validOrder, [expected]: "" };
      delete data.id;

      const response = await request(app)
        .post(ATTACHED_PATH)
        .set("Accept", "application/json")
        .send({
          data,
        });

      expect(response.body.data).toBeUndefined();

      expect(response.body.error).toContain(expected);
      expect(response.status).toBe(400);
    });

    test("returns 400 if dishes is missing", async () => {
      const expected = "dishes";
      const data = { ...validOrder };
      delete data.id;
      delete data[expected];

      const response = await request(app)
        .post(ATTACHED_PATH)
        .set("Accept", "application/json")
        .send({
          data,
        });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("dish");
      expect(response.status).toBe(400);
    });

    test("returns 400 if dishes is empty", async () => {
      const data = { ...validOrder, dishes: [] };
      delete data.id;

      const response = await request(app)
        .post(ATTACHED_PATH)
        .set("Accept", "application/json")
        .send({
          data,
        });

      expect(response.body.data).toBeUndefined();

      expect(response.body.error).toContain("dish");
      expect(response.status).toBe(400);
    });

    test("returns 400 if dishes is not an array", async () => {
      const data = { ...validOrder, dishes: "some-dishes" };

      const response = await request(app)
        .post(ATTACHED_PATH)
        .set("Accept", "application/json")
        .send({
          data,
        });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("dish");
      expect(response.status).toBe(400);
    });

    test("returns 400 if a dish is missing quantity", async () => {
      const dishes = [
        {
          id: "90c3d873684bf381dfab29034b5bba73",
          name: "Falafel and tahini bagel",
          description: "A warm bagel filled with falafel and tahini",
          image_url:
            "https://images.pexels.com/photos/4560606/pexels-photo-4560606.jpeg?h=530&w=350",
          price: 6,
          quantity: 1,
        },
        {
          id: "d351db2b49b69679504652ea1cf38241",
          name: "Dolcelatte and chickpea spaghetti",
          description:
            "Spaghetti topped with a blend of dolcelatte and fresh chickpeas",
          image_url:
            "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?h=530&w=350",
          price: 19,
          // quantity: 2,
        },
      ];
      const data = { ...validOrder, dishes };

      const response = await request(app)
        .post(ATTACHED_PATH)
        .set("Accept", "application/json")
        .send({
          data,
        });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("1");
      expect(response.body.error).toContain("quantity");
      expect(response.status).toBe(400);
    });

    test("returns 400 if a dish quantity is zero", async () => {
      const dishes = [
        {
          id: "90c3d873684bf381dfab29034b5bba73",
          name: "Falafel and tahini bagel",
          description: "A warm bagel filled with falafel and tahini",
          image_url:
            "https://images.pexels.com/photos/4560606/pexels-photo-4560606.jpeg?h=530&w=350",
          price: 6,
          quantity: 0,
        },
        {
          id: "d351db2b49b69679504652ea1cf38241",
          name: "Dolcelatte and chickpea spaghetti",
          description:
            "Spaghetti topped with a blend of dolcelatte and fresh chickpeas",
          image_url:
            "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?h=530&w=350",
          price: 19,
          quantity: 2,
        },
      ];
      const data = { ...validOrder, dishes };

      const response = await request(app)
        .post(ATTACHED_PATH)
        .set("Accept", "application/json")
        .send({
          data,
        });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("0");
      expect(response.body.error).toContain("quantity");
      expect(response.status).toBe(400);
    });

    test("returns 400 if a dish quantity is not an integer", async () => {
      const dishes = [
        {
          id: "90c3d873684bf381dfab29034b5bba73",
          name: "Falafel and tahini bagel",
          description: "A warm bagel filled with falafel and tahini",
          image_url:
            "https://images.pexels.com/photos/4560606/pexels-photo-4560606.jpeg?h=530&w=350",
          price: 6,
          quantity: 1,
        },
        {
          id: "d351db2b49b69679504652ea1cf38241",
          name: "Dolcelatte and chickpea spaghetti",
          description:
            "Spaghetti topped with a blend of dolcelatte and fresh chickpeas",
          image_url:
            "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?h=530&w=350",
          price: 19,
          quantity: 2,
        },
        {
          id: "3c637d011d844ebab1205fef8a7e36ea",
          name: "Broccoli and beetroot stir fry",
          description: "Crunchy stir fry featuring fresh broccoli and beetroot",
          image_url:
            "https://images.pexels.com/photos/4144234/pexels-photo-4144234.jpeg?h=530&w=350",
          price: 15,
          quantity: "7",
        },
      ];

      const data = { ...validOrder, dishes };

      const response = await request(app)
        .post(ATTACHED_PATH)
        .set("Accept", "application/json")
        .send({
          data,
        });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("2");
      expect(response.body.error).toContain("quantity");
      expect(response.status).toBe(400);
    });
  });

  describe("read method", () => {
    test("returns an existing order", async () => {
      const expected = { ...validOrder, id: "42" };

      orders.push(expected);

      const response = await request(app)
        .get(`${ATTACHED_PATH}/42`)
        .set("Accept", "application/json");

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toEqual(expected);
      expect(response.status).toBe(200);
    });

    test("returns 404 for non-existent order", async () => {
      const response = await request(app)
        .get(`${ATTACHED_PATH}/77`)
        .set("Accept", "application/json");

      expect(response.body.error).not.toBeUndefined();
      expect(response.status).toEqual(404);
    });
  });

  describe("update method", () => {
    test("returns 404 if order does not exist", async () => {
      const data = { ...validOrder };

      const response = await request(app)
        .put(`${ATTACHED_PATH}/13`)
        .set("Accept", "application/json")
        .send({ data });

      expect(response.body.error).not.toBeUndefined();
      expect(response.status).toBe(404);
    });

    test("updates the order", async () => {
      orders.push({ ...validOrder, id: "14" });

      const expected = {
        ...validOrder,
        id: "14",
        deliverTo: "4711 Kelley Road, Gulfport, MS 39503",
      };

      const response = await request(app)
        .put(`${ATTACHED_PATH}/14`)
        .set("Accept", "application/json")
        .send({ data: expected });

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toEqual(expected);
      expect(response.status).toBe(200);
    });

    test("returns 400 if data.id does not match :orderId in the route", async () => {
      orders.push({ ...validOrder, id: "14" });
      const expected = { ...validOrder, id: "19" };

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

    test("updates the order if data.id is missing, even though it does not match :orderId in the route", async () => {
      orders.push({ ...validOrder, id: "14" });
      const expected = { ...validOrder };
      delete expected.id;

      const response = await request(app)
        .put(`${ATTACHED_PATH}/14`)
        .set("Accept", "application/json")
        .send({
          data: expected,
        });

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toEqual({ ...expected, id: "14" });
      expect(response.status).toBe(200);
    });

    test("updates the order if data.id is empty, even though it does not match :orderId in the route", async () => {
      orders.push({ ...validOrder, id: "14" });
      const expected = { ...validOrder, id: "" };

      const response = await request(app)
        .put(`${ATTACHED_PATH}/14`)
        .set("Accept", "application/json")
        .send({
          data: expected,
        });

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toEqual({ ...expected, id: "14" });
      expect(response.status).toBe(200);
    });

    test("updates the order if data.id is null, even though it does not match :orderId in the route", async () => {
      orders.push({ ...validOrder, id: "14" });
      const expected = { ...validOrder, id: null };

      const response = await request(app)
        .put(`${ATTACHED_PATH}/14`)
        .set("Accept", "application/json")
        .send({
          data: expected,
        });

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toEqual({ ...expected, id: "14" });
      expect(response.status).toBe(200);
    });

    test("updates the order if data.id is undefined, even though it does not match :orderId in the route", async () => {
      orders.push({ ...validOrder, id: "14" });
      const expected = { ...validOrder, id: undefined };

      const response = await request(app)
        .put(`${ATTACHED_PATH}/14`)
        .set("Accept", "application/json")
        .send({
          data: expected,
        });

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toEqual({ ...expected, id: "14" });
      expect(response.status).toBe(200);
    });

    test("returns 400 if deliverTo is missing", async () => {
      orders.push({ ...validOrder, id: "15" });
      const expected = "deliverTo";
      const data = { ...validOrder, id: "15" };
      delete data[expected];

      const response = await request(app)
        .put(`${ATTACHED_PATH}/15`)
        .set("Accept", "application/json")
        .send({
          data,
        });

      expect(response.body.data).toBeUndefined();

      expect(response.body.error).toContain(expected);
      expect(response.status).toBe(400);
    });

    test("returns 400 if deliverTo is empty", async () => {
      orders.push({ ...validOrder, id: "16" });
      const expected = "deliverTo";
      const data = { ...validOrder, id: "16", [expected]: "" };

      const response = await request(app)
        .put(`${ATTACHED_PATH}/16`)
        .set("Accept", "application/json")
        .send({
          data,
        });

      expect(response.body.data).toBeUndefined();

      expect(response.body.error).toContain(expected);
      expect(response.status).toBe(400);
    });

    test("returns 400 if mobileNumber is missing", async () => {
      orders.push({ ...validOrder, id: "17" });
      const expected = "mobileNumber";
      const data = { ...validOrder, id: "17" };
      delete data[expected];

      const response = await request(app)
        .put(`${ATTACHED_PATH}/17`)
        .set("Accept", "application/json")
        .send({
          data,
        });

      expect(response.body.data).toBeUndefined();

      expect(response.body.error).toContain(expected);
      expect(response.status).toBe(400);
    });

    test("returns 400 if mobileNumber is empty", async () => {
      orders.push({ ...validOrder, id: "18" });
      const expected = "mobileNumber";
      const data = { ...validOrder, id: "18", [expected]: "" };

      const response = await request(app)
        .put(`${ATTACHED_PATH}/18`)
        .set("Accept", "application/json")
        .send({
          data,
        });

      expect(response.body.data).toBeUndefined();

      expect(response.body.error).toContain(expected);
      expect(response.status).toBe(400);
    });

    test("returns 400 if dishes is missing", async () => {
      orders.push({ ...validOrder, id: "19" });
      const expected = "dishes";
      const data = { ...validOrder, id: "19" };
      delete data[expected];

      const response = await request(app)
        .put(`${ATTACHED_PATH}/19`)
        .set("Accept", "application/json")
        .send({
          data,
        });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("dish");
      expect(response.status).toBe(400);
    });

    test("returns 400 if dishes is empty", async () => {
      orders.push({ ...validOrder, id: "20" });
      const data = { ...validOrder, id: "20", dishes: [] };

      const response = await request(app)
        .put(`${ATTACHED_PATH}/20`)
        .set("Accept", "application/json")
        .send({
          data,
        });

      expect(response.body.data).toBeUndefined();

      expect(response.body.error).toContain("dish");
      expect(response.status).toBe(400);
    });

    test("returns 400 if dishes is not an array", async () => {
      orders.push({ ...validOrder, id: "21" });
      const data = { ...validOrder, id: "21", dishes: "some-dishes" };

      const response = await request(app)
        .put(`${ATTACHED_PATH}/21`)
        .set("Accept", "application/json")
        .send({
          data,
        });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("dish");
      expect(response.status).toBe(400);
    });

    test("returns 400 if a dish is missing quantity", async () => {
      orders.push({ ...validOrder, id: "22" });
      const dishes = [
        {
          id: "90c3d873684bf381dfab29034b5bba73",
          name: "Falafel and tahini bagel",
          description: "A warm bagel filled with falafel and tahini",
          image_url:
            "https://images.pexels.com/photos/4560606/pexels-photo-4560606.jpeg?h=530&w=350",
          price: 6,
          quantity: 1,
        },
        {
          id: "d351db2b49b69679504652ea1cf38241",
          name: "Dolcelatte and chickpea spaghetti",
          description:
            "Spaghetti topped with a blend of dolcelatte and fresh chickpeas",
          image_url:
            "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?h=530&w=350",
          price: 19,
          // quantity: 2,
        },
      ];
      const data = { ...validOrder, id: "22", dishes };

      const response = await request(app)
        .put(`${ATTACHED_PATH}/22`)
        .set("Accept", "application/json")
        .send({
          data,
        });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("1");
      expect(response.body.error).toContain("quantity");
      expect(response.status).toBe(400);
    });

    test("returns 400 if a dish quantity is zero", async () => {
      orders.push({ ...validOrder, id: "23" });
      const dishes = [
        {
          id: "90c3d873684bf381dfab29034b5bba73",
          name: "Falafel and tahini bagel",
          description: "A warm bagel filled with falafel and tahini",
          image_url:
            "https://images.pexels.com/photos/4560606/pexels-photo-4560606.jpeg?h=530&w=350",
          price: 6,
          quantity: 0,
        },
        {
          id: "d351db2b49b69679504652ea1cf38241",
          name: "Dolcelatte and chickpea spaghetti",
          description:
            "Spaghetti topped with a blend of dolcelatte and fresh chickpeas",
          image_url:
            "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?h=530&w=350",
          price: 19,
          quantity: 2,
        },
      ];
      const data = { ...validOrder, id: "23", dishes };

      const response = await request(app)
        .put(`${ATTACHED_PATH}/23`)
        .set("Accept", "application/json")
        .send({
          data,
        });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("0");
      expect(response.body.error).toContain("quantity");
      expect(response.status).toBe(400);
    });

    test("returns 400 if a dish quantity is not an integer", async () => {
      orders.push({ ...validOrder, id: "24" });
      const dishes = [
        {
          id: "90c3d873684bf381dfab29034b5bba73",
          name: "Falafel and tahini bagel",
          description: "A warm bagel filled with falafel and tahini",
          image_url:
            "https://images.pexels.com/photos/4560606/pexels-photo-4560606.jpeg?h=530&w=350",
          price: 6,
          quantity: 1,
        },
        {
          id: "d351db2b49b69679504652ea1cf38241",
          name: "Dolcelatte and chickpea spaghetti",
          description:
            "Spaghetti topped with a blend of dolcelatte and fresh chickpeas",
          image_url:
            "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?h=530&w=350",
          price: 19,
          quantity: 2,
        },
        {
          id: "3c637d011d844ebab1205fef8a7e36ea",
          name: "Broccoli and beetroot stir fry",
          description: "Crunchy stir fry featuring fresh broccoli and beetroot",
          image_url:
            "https://images.pexels.com/photos/4144234/pexels-photo-4144234.jpeg?h=530&w=350",
          price: 15,
          quantity: "7",
        },
      ];

      const data = { ...validOrder, id: "24", dishes };

      const response = await request(app)
        .put(`${ATTACHED_PATH}/24`)
        .set("Accept", "application/json")
        .send({
          data,
        });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("2"); // 2 refers to the index
      expect(response.body.error).toContain("quantity");
      expect(response.status).toBe(400);
    });

    test("returns 400 if status is missing", async () => {
      orders.push({ ...validOrder, id: "25" });
      const expected = "status";
      const data = { ...validOrder, id: "25" };
      delete data[expected];

      const response = await request(app)
        .put(`${ATTACHED_PATH}/25`)
        .set("Accept", "application/json")
        .send({
          data,
        });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain(expected);
      expect(response.status).toBe(400);
    });

    test("returns 400 if status is empty", async () => {
      orders.push({ ...validOrder, id: "26" });
      const expected = "status";
      const data = { ...validOrder, id: "26", [expected]: "" };

      const response = await request(app)
        .put(`${ATTACHED_PATH}/26`)
        .set("Accept", "application/json")
        .send({
          data,
        });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain(expected);
      expect(response.status).toBe(400);
    });

    test("returns 400 if status is invalid", async () => {
      orders.push({ ...validOrder, id: "27" });
      const expected = "status";
      const data = { ...validOrder, id: "27", [expected]: "invalid" };

      const response = await request(app)
        .put(`${ATTACHED_PATH}/27`)
        .set("Accept", "application/json")
        .send({
          data,
        });

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain(expected);
      expect(response.status).toBe(400);
    });
  });

  describe("delete method", () => {
    test("returns 204 for existing order", async () => {
      orders.push({ ...validOrder, id: "22" });

      const response = await request(app)
        .delete(`${ATTACHED_PATH}/22`)
        .set("Accept", "application/json");

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toBeUndefined();
      expect(response.status).toBe(204);
      
      const deleted = await request(app)
        .get(`${ATTACHED_PATH}/22`)
        .set("Accept", "application/json");
      expect(response.body.data).toBeUndefined();
      expect(deleted.status).toBe(404);
    });
    test("returns 404 for non-existent order", async () => {
      const response = await request(app)
        .delete(`${ATTACHED_PATH}/23`)
        .set("Accept", "application/json");

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("23");
      expect(response.status).toBe(404);
    });
    test("returns 400 if order.status !== 'pending'", async () => {
      orders.push({ ...validOrder, id: "30", status: "preparing" });

      const response = await request(app)
        .delete(`${ATTACHED_PATH}/30`)
        .set("Accept", "application/json");

      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("pending");
      expect(response.status).toBe(400);
    });
  });

  describe("list method", () => {
    test("returns list of orders", async () => {
      const expected = [
        {
          id: "f6069a542257054114138301947672ba",
          deliverTo: "1600 Pennsylvania Avenue NW, Washington, DC 20500",
          mobileNumber: "(202) 456-1111",
          status: "out-for-delivery",
          dishes: [
            {
              id: "90c3d873684bf381dfab29034b5bba73",
              name: "Falafel and tahini bagel",
              description: "A warm bagel filled with falafel and tahini",
              image_url:
                "https://images.pexels.com/photos/4560606/pexels-photo-4560606.jpeg?h=530&w=350",
              price: 6,
              quantity: 1,
            },
          ],
        },
        {
          id: "5a887d326e83d3c5bdcbee398ea32aff",
          deliverTo: "308 Negra Arroyo Lane, Albuquerque, NM",
          mobileNumber: "(505) 143-3369",
          status: "delivered",
          dishes: [
            {
              id: "d351db2b49b69679504652ea1cf38241",
              name: "Dolcelatte and chickpea spaghetti",
              description:
                "Spaghetti topped with a blend of dolcelatte and fresh chickpeas",
              image_url:
                "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?h=530&w=350",
              price: 19,
              quantity: 2,
            },
          ],
        },
      ];

      orders.push(...expected);

      const response = await request(app)
        .get(ATTACHED_PATH)
        .set("Accept", "application/json");

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toEqual(expected);
      expect(response.status).toBe(200);
    });
  });
});
