import { AdTier } from "../models/AdTier";
import { Customer, CustomerID } from "../models/Customer";

/**
 * PricingRules represents an abstraction capable of returning prices for ads for customers with either special or default pricing
 */
export interface PricingRules {
    
    addSpecialPrice(cust: Customer, teir: AdTier, price: number): Promise<void>;
    
    getPrice(tier: AdTier, cust?: Customer): Promise<number>;
}

/**
 * InMemoryPricingRules implements a PricingRules compliant interface backed by an in-memory data store
 */
export class InMemoryPricingRules implements PricingRules {

    private readonly defaultPricing: inMemoryAdPricingStorage;

    private readonly priceOverrides: inMemoryCustomerPricingStorage = new Map<CustomerID, Map<AdTier, number>>();

    constructor(defaultPricing: Map<AdTier, number>) {
        this.defaultPricing = defaultPricing;
    }

    getPrice(tier: AdTier, cust?: Customer): Promise<number> {
        const haveCustomer = typeof cust === typeof this;
        const customerID = haveCustomer? cust.identifier: void 0;
        const custHasSpecialPricing: boolean = haveCustomer && this.priceOverrides.has(customerID);
        const overrideForSelectedTier: boolean = custHasSpecialPricing && this.priceOverrides.get(customerID).has(tier);
        if (overrideForSelectedTier) {
            return Promise.resolve(this.priceOverrides.get(cust.identifier).get(tier));
        }
        if (!this.defaultPricing.has(tier)) {
            throw new Error("unknown ad tier");
        }
        return Promise.resolve(this.defaultPricing.get(tier));
    }

    addSpecialPrice(cust: Customer, teir: AdTier, price: number): Promise<void> {
        const customerID = cust.identifier;
        const customerAlreadySpecial = this.priceOverrides.has(customerID);
        if (!customerAlreadySpecial) {
            this.priceOverrides.set(customerID, new Map<AdTier, number>());
        }
        this.priceOverrides.get(customerID).set(teir, price);
        return Promise.resolve();
    }

}

type inMemoryAdPricingStorage = Map<AdTier, number>;

type inMemoryCustomerPricingStorage = Map<CustomerID, inMemoryAdPricingStorage>;