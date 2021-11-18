import { AdTier } from "../src/models/AdTier";
import { PricingRules, InMemoryPricingRules } from "../src/pricing";

export const makeDefaultPricingRules = (classic: number, standout: number, premium: number): PricingRules => {
    return new InMemoryPricingRules(
        new Map<AdTier, number>().
            set(AdTier.Classic,  classic).
            set(AdTier.StandOut, standout).
            set(AdTier.Premium,  premium)
    );
};