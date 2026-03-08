const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/User");

const { MongoMemoryServer } = require("mongodb-memory-server");

require("dotenv").config();

let mongoServer;

// Fix jest open handle issues by setting a timeout and closing connection
describe("Auth API Endpoints", () => {
    jest.setTimeout(60000); // 60 seconds timeout

    beforeAll(async () => {
        // Start In-Memory MongoDB Server
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        await mongoose.connect(uri);
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    let token = "";

    it("should register a new user", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "password123",
                role: "admin"
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("token");
    });

    it("should login the user and return a token", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test@example.com",
                password: "password123"
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("token");
        token = res.body.token;
    });

    it("should block access to a protected route without token", async () => {
        const res = await request(app).get("/api/clients");
        expect(res.statusCode).toEqual(401);
    });
});
