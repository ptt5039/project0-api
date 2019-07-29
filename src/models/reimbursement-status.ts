export class ReimbursementStatus {
    constructor(
        public statusId: number, // primary key
        public status: string // not null, unique
    ) { }
}