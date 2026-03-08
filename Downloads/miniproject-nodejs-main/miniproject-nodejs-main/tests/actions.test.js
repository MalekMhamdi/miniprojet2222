const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const Client = require("../src/models/Client");
const Facture = require("../src/models/Facture");
const ActionRecouvrement = require("../src/models/ActionRecouvrement");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let token;
let factureId;

describe("Actions API", () => {
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
    const facture = await Facture.create({ client: client._id, montant: 200 });
    factureId = facture._id;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await ActionRecouvrement.deleteMany({});
  });

  it("should create a new action", async () => {
    const res = await request(app)
      .post("/api/actions")
      .set("Authorization", `Bearer ${token}`)
      .send({ facture: factureId, type: "appel", commentaire: "Premier appel" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.type).toBe("appel");
  });

  it("should get all actions", async () => {
    await ActionRecouvrement.create({ facture: factureId, agent: mongoose.Types.ObjectId(), type: "email" });
    const res = await request(app)
      .get("/api/actions")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });
});