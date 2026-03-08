const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const Client = require("../src/models/Client");
const Facture = require("../src/models/Facture");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let token;
let clientId;

describe("Factures API", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    const userRes = await request(app).post("/api/auth/register").send({
      name: "Admin Test",
      email: "admin@test.com",
      password: "password123",
      role: "admin"
    });
    token = userRes.body.token;

    const client = await Client.create({ name: "Client Test" });
    clientId = client._id;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Facture.deleteMany({});
  });

  it("should create a new facture", async () => {
    const res = await request(app)
      .post("/api/factures")
      .set("Authorization", `Bearer ${token}`)
      .send({ client: clientId, montant: 100, dateEmission: new Date() });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.statut).toBe("impayee");
  });

  it("should get all factures", async () => {
    await Facture.create({ client: clientId, montant: 50 });
    const res = await request(app)
      .get("/api/factures")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });
});