import { AdTier } from "./AdTier";

/**
 * Item instances are individual ads that can be purchased by Customers
 */
export class Item {
    logo: URL;
    text: string;
    tier: AdTier;

    constructor(tier: AdTier, text: string, logo?: URL) {
        this.tier = tier;
        this.text = text;
        this.logo = logo;
    }

}
