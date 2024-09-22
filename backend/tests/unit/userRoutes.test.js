const server = require("../../server.js");
const request = require("supertest");
const fixture = require("../fixtures/users.js");

describe("Register", () => {
    test("should return 'Not authorized' if no token is sent", async () => {
        const response = await request(server)
            .get("/api/v1/users")
            .expect(401)
            .expect("Content-Type", /json/);
        expect(response.body.message).toEqual("Not authorized");
    });

    test("twice should return an error to the user", async () => {
        let response = await request(server)
            .post("/api/v1/users/register")
            .set("Accept", "application/json")
            .send(fixture.register);

        response = await request(server)
            .post("/api/v1/users/register")
            .set("Accept", "application/json")
            .send(fixture.register);
        expect(response.body.message).toEqual("User already exists");
    });
});

describe("Login", () => {
    test("should return payload if valid user is logged in", async () => {
        let response = await request(server)
            .post("/api/v1/users/register")
            .set("Accept", "application/json")
            .send({
                firstName: "Jane",
                lastName: "Doe",
                email: "jane.doe@gmail.com",
                password: "password",
            });
        const token = response.body.token;

        response = await request(server)
            .get("/api/v1/users/")
            .set({ "Authorization": `Bearer ${token}` })
            .expect(200);
        expect(response.body.text).toEqual("Get user");
    });

    test("should not log user into the system", async () => {
        await request(server)
            .post("/api/v1/users/login")
            .send({
                email: "jack.doe@gmail.com",
                password: "password"
            })
            .expect(400);
    });
});