# TypeScript Job Ad Pricing Engine
This project is an example of TypeScript business logic within the job advertising domain with minimal pricing rules being implemented with unit tests and no other logic (i.e. API/server code, etc).

## Challenge
For the purpose of this challenge, an online job advertising company is in the process of rewriting its job ads checkout system in TypeScript.

### Products
The company operates by selling job ads.  The required system must be able to offer different products to recruiters:

| Product Tier | Description | Standard Price |
|--------------|-------------|---------------:|
|  Classic Ad  | Offers the most basic level of advertisement | $269.99 |
| Stand Out Ad | Allows advertisers to use a company logo and use a longer presentation text | $322.99 |
|  Premium Ad  | Same benefits as Standout Ad, but also puts the advertisement at the top of the results, allowing higher visibility | $394.99 |

### Special Pricing
The company offers volume discounts to some customers.  Specifically, the following special pricing rules for a small number of privileged customers:
1) SecondBite
    * Gets a *​3 for 2​* deal on _​Classic Ads_
2) Axil Coffee Roasters
    * Gets a discount on _Stand Out Ads_ where the price drops to *​$299.99 ​per ad*
3) MYER
    * Gets a ​*5 for 4​* deal on _​Stand Out Ads_
    * Gets a discount on _​Premium Ads​_ where the price drops to *​$389.99​ per ad*

These details are regularly renegotiated, so the pricing rules need to be as flexible as possible as they
can ​change​ in the future with little notice.

### Service Interface
The interface to the checkout looks like this pseudocode:
```
Checkout co = Checkout.new(pricingRules)
co.add(item1)
co.add(item2)
co.total()
```

### Example Scenarios
```
Customer: default
Items: 'classic', 'standout', 'premium'
Total: $987.97

Customer: SecondBite
Items: 'classic', 'classic', 'classic', 'premium'
Total: $934.97

Customer: Axil Coffee Roasters
Items: 'standout', 'standout', 'standout', 'premium'
Total: $1294.96
```

## Solution
### Assumptions
1) _N-for-M_ Discounts, such as &quot;3 for 2&quot; or &quot;5 for 4&quot; are assumed to be calculated on a single-itemwise basis.  For example, a 5-for-4 discount simply means each item costs 80% (or 4/5<sup>th</sup>'s) of the standard price, irregardless of the quantity (i.e. the customer does not need to actually _buy_ 5 ads of that tier to get the discounted price).
2) Negative prices, while not prevented via validation in the solution, are not supported and their use may result in undefined behaviour.
3) Other desirable business level field validation, such as ensuring items have valid URLs for the logo, or have non-empty strings for the ad text, are not required for this challenge as it relates only to the core of calculation of special pricing rules.
### Exclusions
1) Any and all wrapping controller or transport logic (such as a HTTP API, etc) around the implemented pricing business logic is excluded (although may be a suitable extension).
2) Any logic pertaining to the presentation of the solution within any form of UI or supporting a font-end of any kind is excluded (although may be a suitable extension).
3) Logic required to interact with permanant databases (such as DynamoDB, MongoDB, Postgres or MySQL, etc) is excliuded (although may be a suitable extension).
4) Emitting of events for consumption by other services or units of business logic (such as the event of an ad tier price change for a customer) is excluded (although may be a suitable extension).
5) For the purposes of brevity (particularly for the command line example code), logging of events and decisions made by the solution has also been excluded (although in a true production codebase would be built-out).

### Prerequisites
Building & running this project will require a development environment with:
 * NodeJS
 * NPM

 Furthermore, following checkout of the code for the first time, the dependency cache will need to be populated.  This can be done ahead of build-time with the following command:
 ```
 npm install
 ```

### Structure
#### Directory structure
```
├──coverage
├──dist
├──node_modules
├──src
│    ├──checkout
│    ├──models
│    └──pricing
└──test
```

 * `coverage` is the _test coverage_ directory, where unit test coverage artefacts are placed when running tests.  This directory should not be checked-in to source control.
 * `dist` is the _output_ directory, where distribution ready transpiled TypeScript files will be placed.  This directory should not be checked-in to source control.
 * `node_modules` is the _dependency cache_ directory, where the Node Package Manager (`npm`) tool will place a cached copy of required dependencies.  This directory should not be checked-in to source control.
 * `src` is the _source code_ directory, where production ready &quot;business logic&quot; code that implements domain specific logic is placed.  This directory and all sub-directories, **should** be checked-in to source control.
    * `checkout`
    * `models`
    * `pricing`
* `test` is the _unit test_ directory, in which the source code for verifiable and repeatable unit tests are placed.  This directory **should** be checked-in to source control.

#### Code Structure
The codebase for the solution contains three principal parts:

*Models* are the data structures abstracted out of the problem domain, and include customers (whom purchase items), items themselves, as well as the (pricing) tier for particular items.

*Pricing* is the core business logic for the challenge, containing the logic required for the tracking of specialised pricing for different customers, as well as the recording of the default or standard prices for ads.

*Checkout* contains all of the logic associated with _totalling_ a set of items, either for a specific customer or for the _default customer_ (whom always recieves standard pricing).

### Building & Running
#### Building
The solution has been implemented using `npm` tooling and has npm based _scripts_ to control various lifecycle operations such as building, testing and demo execution.
The TypeScript codebase can be built (transpiled into the `dist/` directory) via the following command:
```
npm run build
```

#### Running the Example Scenarios
The example scenario above has been replicated in an _example_ main file (`src/index.example.ts`).  This can be run (after building) with the following command:
```
npm run demo
```

### Running Unit Tests
The solution contains `15` tests over `2` test suites.  These can be run via `jest` using the script:
```
npm run test
```
This will transpile the source code and execute the test suites, generating a code coverage report into the `coverage` directory.

## Extensions
### Encapsulate Business Logic within an API
The present solution does not implement any sort of communications or transport level logic to allow the implemented business logic to be accessed via other systems.  One possible extension would be to encapsulate the checkout totalling logic here into an API endpoint that other (micro-)services could then access for this purpose.  This work could be accomplished via the use of a HTTP server library such as `express` and the implementation of a _contoller_ which would in-turn (following any required input validation and authentication & authorization checks) call into the `Checkout` service herein.  This could take the form of either a HTTP REST or GraphQL based API.

### Build Job Ad Sorting and Presentation UI
The present solution only features a very basic text-only rendering of item price calculations with a simple display logic.  It would be possible to extend this into a more fully-fledged user interface (UI), such as a web-based single page application and/or progressive web app.  Such an extension could be achieveed using TypeScript code along with a frontend framework such as React, where-in componenets could be developed to communicate with the implemented business logic herein.  This would most likely be done in combination with the development of some encapsulating API logic for the current codebase.

### Build Pricing Rules Database Persistance
At present the only implementation of the `PricingRules` interface is the `InMemoryPRicingRules`, which uses a NodeJS `Map` data-structure as it's (ephemeral) backing-store.  One extension that would be required in-order to make this codebase operatinal from a production context would be the development of logic to interface the pricing rules with a persistent datastore, such as a database.  This could be achieved in different ways for differing underlaying database systems, such as via the `Knex.JS` library for connection to a relational database such as Postgres or MySQL.  Or via a vendor specific software development kit (SDK) for a document-based database, such as using the AWS SDK to connect to Amazon DynamoDB.

### Refactor N-for-M Discount Business Logic
Currently the solution assumes an itemwise basis for discount prices, and does not take item quantity into account when totalling a checkout.  It may be desirable for the business for this logic to be amended such that N-for-M type discounts are only applied to checkouts that indeed meed the minimum required quantity (N) before applying the discount.  Items in excess of this minimum may either be charged at the discount or standard rate, depending upon requirements gathered from the business.

### Emit Events on Pricing Rules for Changes
Presently the pricing rules logic makes no attempt to inform or make other systems aware of any changes in pricing (either the standrd pricing or special pricing for customers).  One possible extension would be to enhance the pricing rules logic to emit events to an event bus (such as Amazon EventBridge, etc) when such changes are made to underlaying data.  This would then permit other systems to collect, analysie or otherwise process this information.  For example, a historical analysis of special pricing for customers could be implemented to consumer and archive this pricing data.

---
Copyright 2021 (C) Lawrence Colman, All Rights Reserved.
