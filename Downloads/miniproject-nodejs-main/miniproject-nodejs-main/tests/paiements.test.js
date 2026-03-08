const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const Client = require("../src/models/Client");
const Facture = require("../src/models/Facture");
const Paiement = require("../src/models/Paiement");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let token;
let factureId;

describe("Paiements API", () => {
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
    await Paiement.deleteMany({});
    await Facture.updateMany({}, { statut: "impayee" });
  });

  it("should record a paiement", async () => {
    const res = await request(app)
      .post("/api/paiements")
      .set("Authorization", `Bearer ${token}`)
      .send({ facture: factureId, montant: 100 });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("paiement");
    expect(res.body.nouveauStatutFacture).toBe("partielle");
  });
});