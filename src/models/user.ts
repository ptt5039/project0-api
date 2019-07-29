import { Role } from './role';

export class User {
    constructor(
        public userId: number, // primary key
        public username: string, // not null, unique
        public password: string, // not null
        public firstName: string, // not null
        public lastName: string, // not null
        public email: string, // not null
        public role: Role // not null
    ) { }
}