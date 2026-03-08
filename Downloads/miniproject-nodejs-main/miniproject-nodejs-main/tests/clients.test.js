const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const Client = require("../src/models/Client");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let token; // token d'auth pour routes protégées

describe("Clients API", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    // Créer un utilisateur admin pour obtenir un token
    const res = await request(app).post("/api/auth/register").send({
      name: "Admin Test",
      email: "admin@test.com",
      password: "password123",
      role: "admin"
    });
    token = res.body.token;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Client.deleteMany({});
  });

  it("should create a new client", async () => {
    const res = await request(app)
      .post("/api/clients")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Client 1", email: "client1@test.com", phone: "1234567890", address: "Rue Test" });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe("Client 1");
  });

  it("should get all clients", async () => {
    await Client.create({ name: "Client 2" });
    const res = await request(app)
      .get("/api/clients")
      .set("Authorization", `Bearer ${token}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });
});