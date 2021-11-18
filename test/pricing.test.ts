import { AdTier } from "../src/models/AdTier";
import { Customer } from "../src/models/Customer";
import { makeDefaultPricingRules } from "./utils";

describe("getPrice", () => {
    it("should return correct default price for Classic Ad", async () => {
        expect(await makeDefaultPricingRules(13.37, NaN, NaN).getPrice(AdTier.Classic)).toEqual(13.37);
    });

    it("should return correct default price for StandOut Ad", async () => {
        expect(await makeDefaultPricingRules(NaN, 13.37, NaN).getPrice(AdTier.StandOut)).toEqual(13.37);
    });

    it("should return correct default price for Premium Ad", async () => {
        expect(await makeDefaultPricingRules(NaN, NaN, 13.37).getPrice(AdTier.Premium)).toEqual(13.37);
    });

    it("should return \"unknown ad tier\" error for undefined tier", async () => {
        const subject = makeDefaultPricingRules(1, 2, 3);
        try {
            await subject.getPrice(undefined);
        } catch (e) {
            expect(e.toString()).toEqual("Error: unknown ad tier");
        }
    });

    it("should return correct special price for Classic Ad", async () => {
        const testCustomer = new Customer("TEST", "Test Customer");
        const pricingRules = makeDefaultPricingRules(10, 20, 30);
        pricingRules.addSpecialPrice(testCustomer, AdTier.Classic, 1.23);
        expect(await pricingRules.getPrice(AdTier.Classic, testCustomer)).toEqual(1.23);
    });

    it("should return correct special price for StandOut Ad", async () => {
        const testCustomer = new Customer("TEST", "Test Customer");
        const pricingRules = makeDefaultPricingRules(10, 20, 30);
        pricingRules.addSpecialPrice(testCustomer, AdTier.StandOut, 1.23);
        expect(await pricingRules.getPrice(AdTier.StandOut, testCustomer)).toEqual(1.23);
    });

    it("should return correct special price for Premium Ad", async () => {
        const testCustomer = new Customer("TEST", "Test Customer");
        const pricingRules = makeDefaultPricingRules(10, 20, 30);
        pricingRules.addSpecialPrice(testCustomer, AdTier.Premium, 1.23);
        expect(await pricingRules.getPrice(AdTier.Premium, testCustomer)).toEqual(1.23);
    });
});

describe("addSpecialPrice", () => {
    const testCustomer = new Customer("TEST", "Test Customer");
    const otherCustomer = new Customer("OTH1", "Other Customer");
    const pricingRules = makeDefaultPricingRules(NaN, NaN, NaN);

    it("should not yet have any special price for Classic Ad", async () => {
        expect(await pricingRules.getPrice(AdTier.Classic, testCustomer)).toBeNaN();
    });

    it("should successfully add a special price for Classic Ad", async () => {
        pricingRules.addSpecialPrice(testCustomer, AdTier.Classic, 13.37);
        expect(await pricingRules.getPrice(AdTier.Classic, testCustomer)).toEqual(13.37);
    });

    it("should not apply one customer's special price to another customer", async () => {
        expect(await pricingRules.getPrice(AdTier.Classic, otherCustomer)).toBeNaN();
    });

    it("should successfully overwrite an existing special price for a customer", async () => {
        pricingRules.addSpecialPrice(testCustomer, AdTier.Classic, 133.7);
        expect(await pricingRules.getPrice(AdTier.Classic, testCustomer)).toEqual(133.7);
    });
});
