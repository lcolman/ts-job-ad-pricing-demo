import { Checkout } from "../src/checkout";
import { AdTier } from "../src/models/AdTier";
import { Customer } from "../src/models/Customer";
import { Item } from "../src/models/Item";
import { makeDefaultPricingRules } from "./utils";

describe("total", () => {
    it("should total to zero when no items have been added", async () => {
        const pricingRules = makeDefaultPricingRules(1, 1, 1);
        const checkout = new Checkout(pricingRules);
        const result = await checkout.total();
        expect(result).toBe(0.0);
    });

    it("should total to the correct price when one default priced item is added", async () => {
        const pricingRules = makeDefaultPricingRules(1, 2, 4);
        const checkout = new Checkout(pricingRules);
        checkout.add(new Item(AdTier.Premium, "testing testing testing"));
        const result = await checkout.total();
        expect(result).toBe(4);
    });

    it("should total to the correct price when one special priced item is added", async () => {
        const testCustomer = new Customer("TEST", "Test Customer");
        const pricingRules = makeDefaultPricingRules(1, 2, 4);
        pricingRules.addSpecialPrice(testCustomer, AdTier.StandOut, 3);
        const checkout = new Checkout(pricingRules);
        checkout.add(new Item(AdTier.StandOut, "testing testing testing"));
        checkout.setCustomer(testCustomer);
        const result = await checkout.total();
        expect(result).toBe(3);
    });

    it("should total to the correct price when one special and one default priced item added", async () => {
        const testCustomer = new Customer("TEST", "Test Customer");
        const pricingRules = makeDefaultPricingRules(100, 400, 1200);
        pricingRules.addSpecialPrice(testCustomer, AdTier.StandOut, 300);
        const checkout = new Checkout(pricingRules);
        checkout.add(new Item(AdTier.Classic,  "testing testing testing"));
        checkout.add(new Item(AdTier.StandOut, "testing testing testing"));
        checkout.setCustomer(testCustomer);
        const result = await checkout.total();
        expect(result).toBe(400);
    });
});
