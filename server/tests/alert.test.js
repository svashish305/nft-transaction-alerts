import { promises as fs } from "fs";
import { jest } from "@jest/globals";
import db from "../util/database.js";

describe("getRuleAlertsMap function", () => {
  let getRulesSpy,
    getUserCacheSpy,
    getFirstNftBuyersSpy,
    getInactiveSellersSpy,
    getHighVolumeBuyersSpy;

  beforeAll(() => {
    getRulesSpy = jest
      .spyOn(fs, "readFile")
      .mockResolvedValue(
        `Trigger a push notification on the very first NFT purchase for the user.\nAlert NFT seller (user) if their NFTs are not sold after 7 days of listing them for sale.\nAlert operator if more than 100 NFTs are purchased by a user within an hour.`
      );

    getUserCacheSpy = jest.spyOn(db, "query").mockResolvedValue([
      { id: 1, email: "test1@test.com", role: "user" },
      { id: 2, email: "test2@test.com", role: "user" },
    ]);

    getFirstNftBuyersSpy = jest.spyOn(db, "query").mockResolvedValue([
      { userid: 1, count: 1 },
      { userid: 2, count: 1 },
    ]);

    getInactiveSellersSpy = jest
      .spyOn(db, "query")
      .mockResolvedValue([{ sellerid: 1 }, { sellerid: 2 }]);

    getHighVolumeBuyersSpy = jest.spyOn(db, "query").mockResolvedValue([
      { userid: 1, count: 101 },
      { userid: 2, count: 125 },
    ]);
  });

  afterAll(() => {
    getRulesSpy.mockRestore();
    getUserCacheSpy.mockRestore();
    getFirstNftBuyersSpy.mockRestore();
    getInactiveSellersSpy.mockRestore();
    getHighVolumeBuyersSpy.mockRestore();
  });

  test("should return the rule alerts map", async () => {

    const mockRuleAlertsMap = jest.fn().mockImplementation(() => {
      getRulesSpy(),
      getUserCacheSpy(),
      getFirstNftBuyersSpy(),
      getInactiveSellersSpy(),
      getHighVolumeBuyersSpy()

      return {
        "Trigger a push notification on the very first NFT purchase for the user.":
          [
            "Congrats test1@test.com! You bought your first NFT!",
            "Congrats test2@test.com! You bought your first NFT!",
          ],
        "Alert NFT seller (user) if their NFTs are not sold after 7 days of listing them for sale.":
          [
            "Hey test1@test.com! You have not sold any NFTs in last 7 days!",
            "Hey test2@test.com! You have not sold any NFTs in last 7 days!",
          ],
        "Alert operator if more than 100 NFTs are purchased by a user within an hour.":
          [
            "Hey Operator! test1@test.com has bought more than 100 NFTs in last hour!",
            "Hey Operator! test2@test.com has bought more than 100 NFTs in last hour!",
          ],
      };
    })

    const expectedMap = {};
    expectedMap[
      "Trigger a push notification on the very first NFT purchase for the user."
    ] = [
      "Congrats test1@test.com! You bought your first NFT!",
      "Congrats test2@test.com! You bought your first NFT!",
    ];
    expectedMap[
      "Alert NFT seller (user) if their NFTs are not sold after 7 days of listing them for sale."
    ] = [
      "Hey test1@test.com! You have not sold any NFTs in last 7 days!",
      "Hey test2@test.com! You have not sold any NFTs in last 7 days!",
    ];
    expectedMap[
      "Alert operator if more than 100 NFTs are purchased by a user within an hour."
    ] = [
      "Hey Operator! test1@test.com has bought more than 100 NFTs in last hour!",
      "Hey Operator! test2@test.com has bought more than 100 NFTs in last hour!",
    ];
    const ruleAlertsMap = mockRuleAlertsMap();

    expect(getRulesSpy).toHaveBeenCalled();
    expect(getUserCacheSpy).toHaveBeenCalled();
    expect(getFirstNftBuyersSpy).toHaveBeenCalled();
    expect(getInactiveSellersSpy).toHaveBeenCalled();
    expect(getHighVolumeBuyersSpy).toHaveBeenCalled();

    expect(ruleAlertsMap).toEqual(expectedMap);
  });

  test("should throw an error when getRules function throws an error", async () => {
    const mockRuleAlertsMap = jest
      .fn()
      .mockImplementation(() => Promise.reject("File read error"));

    getRulesSpy.mockRejectedValueOnce("File read error");

    await expect(mockRuleAlertsMap).rejects.toEqual("File read error");
  });

  test("should throw an error when getUserCache function throws an error", async () => {
    const mockRuleAlertsMap = jest
      .fn()
      .mockImplementation(() => Promise.reject("getUserCache Database error"));

    getUserCacheSpy.mockRejectedValueOnce("getUserCache Database error");

    await expect(mockRuleAlertsMap).rejects.toEqual(
      "getUserCache Database error"
    );
  });

  test("should throw an error when getFirstNftBuyers function throws an error", async () => {
    const mockRuleAlertsMap = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject("getFirstNftBuyers Database error")
      );

    getFirstNftBuyersSpy.mockRejectedValueOnce(
      "getFirstNftBuyers Database error"
    );

    await expect(mockRuleAlertsMap).rejects.toEqual(
      "getFirstNftBuyers Database error"
    );
  });

  test("should throw an error when getInactiveSellers function throws an error", async () => {
    const mockRuleAlertsMap = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject("getInactiveSellers Database error")
      );

    getInactiveSellersSpy.mockRejectedValueOnce(
      "getInactiveSellers Database error"
    );

    await expect(mockRuleAlertsMap).rejects.toEqual(
      "getInactiveSellers Database error"
    );
  });

  test("should throw an error when getHighVolumeBuyers function throws an error", async () => {
    const mockRuleAlertsMap = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject("getHighVolumeBuyers Database error")
      );

    getHighVolumeBuyersSpy.mockRejectedValueOnce(
      "getHighVolumeBuyers Database error"
    );

    await expect(mockRuleAlertsMap).rejects.toEqual(
      "getHighVolumeBuyers Database error"
    );
  });
});
