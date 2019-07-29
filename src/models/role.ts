export class Role {
    constructor(
        public roleId: number, // primary key
        public role: string // not null, unique
    ) { }
}