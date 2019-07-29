export class ReimbursementType {
    constructor(
        public typeId: number, // primary key
        public type: string, // not null, unique
    ) { }
}