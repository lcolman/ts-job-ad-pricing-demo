import { PricingRules } from "../pricing";
import { Customer } from "../models/Customer";
import { Item } from "../models/Item";

/**
 * Checkout class implements logic for the quotation of total pricing for added items for a given customer
 */
export class Checkout {

    private customer?: Customer;

    private readonly items: Array<Item> = [];

    private readonly pricingRules: PricingRules;

    constructor(pricingRules: PricingRules) {
        this.pricingRules = pricingRules;
    }

    add(item: Item): Promise<void> {
        this.items.push(item);
        return Promise.resolve();
    }

    setCustomer(cust: Customer): Promise<void> {
        this.customer = cust;
        return Promise.resolve();
    }

    async total(): Promise<number> {
        if (this.items.length == 0) {
            return Promise.resolve(0);
        }
        const itemPrices: Array<Promise<number>> = this.items.map(
            async (item: Item) => await this.pricingRules.getPrice(item.tier, this.customer)
        );
        const totalPrice: Promise<number> = itemPrices.reduce(
            async (prev: Promise<number>, curr: Promise<number>): Promise<number> => await prev + await curr
        );
        return totalPrice;
    }

}
