import fs from "fs";
import path from "path";
import { QueryTypes } from "sequelize";
import { jest } from "@jest/globals";
import SequelizeMock from "sequelize-mock";

describe("Test alerts for NFT purchase, sale and count", () => {
  const data = `
    user1@example.com
    user2@example.com
    user3@example.com
  `; //sample data
  let db;

  beforeAll(async () => {
    db = new SequelizeMock(); //connect to the database
  });

  afterAll(async () => {
    db = null; //close connection after all tests have run
  });

  beforeEach(async () => {
    jest.resetModules(); //reset modules before each test
    jest.spyOn(fs, "readFile").mockResolvedValue(data); //mock the file reading
    await db.query.mockReset(); //calling the mocked function for each test
  });

  it("should congratulate on first NFT purchase for user", async () => {
    db.query.mockResolvedValueOnce([{ userid: 1 }, { userid: 2 }]); //simulate 2 users who bought their first NFT
    db.query.mockResolvedValueOnce([
      { id: 1, email: "user1@example.com", role: "user" },
      { id: 2, email: "user2@example.com", role: "user" },
    ]); //simulate user information for those 2 users
    const res = await request(app).get("/alerts");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      "Trigger a push notification on the very first NFT purchase for the user.":
        [
          "Congrats user1@example.com! You bought your first NFT!",
          "Congrats user2@example.com! You bought your first NFT!",
        ],
    });
  });

  it("should alert NFT seller (user) if their NFTs are not sold after 7 days of listing them for sale", async () => {
    db.query.mockResolvedValueOnce([{ id: 1 }, { id: 2 }, { id: 3 }]); //simulate 3 users who have not sold any NFTs in last 7 days
    db.query.mockResolvedValueOnce([
      { id: 1, email: "user1@example.com", role: "user" },
      { id: 2, email: "user2@example.com", role: "user" },
      { id: 3, email: "user3@example.com", role: "user" },
    ]); //simulate user information for those 3 users
    const res = await request(app).get("/alerts");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      "Alert NFT seller (user) if their NFTs are not sold after 7 days of listing them for sale.":
        [
          "Hey user1@example.com! You have not sold any NFTs in last 7 days!",
          "Hey user2@example.com! You have not sold any NFTs in last 7 days!",
          "Hey user3@example.com! You have not sold any NFTs in last 7 days!",
        ],
    });
  });

  it("should alert operator if more than 100 NFTs are purchased by a user within an hour", async () => {
    db.query.mockResolvedValueOnce([
      { userid: 1 },
      { userid: 2 },
      { userid: 3 },
    ]); //simulate 3 users who bought more than 100 NFTs in last hour
    db.query.mockResolvedValueOnce([
      { id: 1, email: "user1@example.com", role: "operator" },
      { id: 2, email: "user2@example.com", role: "operator" },
      { id: 3, email: "user3@example.com", role: "operator" },
    ]); //simulate operator information for those 3 users
    const res = await request(app).get("/alerts");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      "Alert operator if more than 100 NFTs are purchased by a user within an hour.":
        [
          "Hey Operator! user1@example.com has bought more than 100 NFTs in last hour!",
          "Hey Operator! user2@example.com has bought more than 100 NFTs in last hour!",
          "Hey Operator! user3@example.com has bought more than 100 NFTs in last hour!",
        ],
    });
  });
});
