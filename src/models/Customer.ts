/**
 * Customer objects are able to be identified uniquely and also have a name suitable for presentation
 */
export class Customer {
    
    readonly identifier: CustomerID;

    readonly name: string;

    constructor(id: CustomerID, name: string) {
        this.identifier = id;
        this.name = name;
    }

}

/** Specialised type representing customer identifiers */
export type CustomerID = string;
