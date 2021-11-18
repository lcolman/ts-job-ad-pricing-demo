import { Checkout } from "./checkout";
import { AdTier } from "./models/AdTier";
import { Customer } from "./models/Customer";
import { Item } from "./models/Item";
import { InMemoryPricingRules, PricingRules } from "./pricing";

// set the default prices (just in memory)
const examplePricingRules: PricingRules = new InMemoryPricingRules(
    new Map<AdTier, number>().
        set(AdTier.Classic,  269.99).
        set(AdTier.StandOut, 322.99).
        set(AdTier.Premium,  394.99)
);

// create some customers
const secondBiteCustomer = new Customer("SB-01", "SecondBite");
const axilCoffeeCustomer = new Customer("AX-01", "Axil Coffee Roasters");
const myerCustomer = new Customer("MYER", "MYER");
const defaultCustomer: Customer = undefined;

// add the special pricing rules
const setupPricing = async () => {
    examplePricingRules.addSpecialPrice(
        secondBiteCustomer, AdTier.Classic,
        await examplePricingRules.getPrice(AdTier.Classic) * 2/3
    );
    examplePricingRules.addSpecialPrice(
        axilCoffeeCustomer, AdTier.StandOut, 299.99
    );
    examplePricingRules.addSpecialPrice(
        myerCustomer, AdTier.StandOut,
        await examplePricingRules.getPrice(AdTier.StandOut) * 4/5
    );
    examplePricingRules.addSpecialPrice(
        myerCustomer, AdTier.Premium, 389.99
    );
};

// example scenarios
const main = async () => {
    await setupPricing();
    [
        {
            customer: defaultCustomer,
            items:    [
                new Item(AdTier.Classic,  "Australin Basket & Co is urgently recruiting to fill an open position for a junior basket weaver in our Melbourne headquarters."),
                new Item(AdTier.StandOut, "The Basket Warehouse is seeking expressions of interest from qualified candidates to manage our retail division.", new URL("https://example.net/logo.png")),
                new Item(AdTier.Premium,  "Global Basket Group Limited is expanding our online operations and requires a junior TypeScript develoer with 20 years experience.", new URL("http://example.com/big_logo.png"))
            ],
        },
        {
            customer: secondBiteCustomer,
            items: [
                new Item(AdTier.Classic, "SecondBite is seeking volunteer truck-drivers in our Melbourne warehouse."),
                new Item(AdTier.Classic, "SecondBite is seeking volunteer truck-drivers in our Sydney warehouse."),
                new Item(AdTier.Classic, "SecondBite is seeking volunteer truck-drivers in our Brisbane warehouse."),
                new Item(AdTier.Premium, "Logistics Manager urgently wanted by charity SecondBite to coordinate trucking of food donations.")
            ],
        },
        {
            customer: axilCoffeeCustomer,
            items: [
                new Item(AdTier.StandOut, "Latte Art Compliance Officer.  Duties include oversight of Latte art patterns and reporting of non-conforming Lattes to corporate."),
                new Item(AdTier.StandOut, "Junior Barista wanted for milk-frothing and bean roasting duties at Axil Coffee Roasters.", new URL("http://latte.art/logo.gif")),
                new Item(AdTier.StandOut, "Associate level Specialty Coffee Snob needed for immediate start with local Melbourne cafe."),
                new Item(AdTier.Premium,  "Coffee Machine Embedded Systems Engineer wanted for C++/C software development work on coffee grinding and roasting algorithms."),
            ],
        },
    ].forEach(async (scenario) => {
        const checkout = new Checkout(examplePricingRules);
        scenario.items.forEach((item) => checkout.add(item));
        checkout.setCustomer(scenario.customer);
        console.log(
            [
                `Customer: ${scenario.customer === defaultCustomer? "default" : scenario.customer.name}`,
                `Items: ${formattedItemList(scenario.items)}`,
                `Total: ${formattedCurrency(await checkout.total())}\n`,
            ].join("\n")
        );
    });
};

// presentation helper functions
function formattedCurrency(price: number): string {
    const twoDecimalPlaces = parseFloat(new Number(price).toFixed(2));
    const currencyFormatter = new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
        currencyDisplay: "narrowSymbol",
        minimumFractionDigits: 2,
    });
    return currencyFormatter.format(twoDecimalPlaces);
}

const formattedItemList = (items: Array<Item>): string => items.map((item) => `'${AdTier[item.tier].toLowerCase()}'`).join(", ");

// run everything
main();
