import { ReimbursementStatus } from './reimbursement-status';
import { ReimbursementType } from './reimbursement-type';
import { User } from './user';

export class Reimbursement {
    constructor(
        public reimbursementId: number, // primary key
        public author: User,  // foreign key -> User, not null
        public amount: number,  // not null
        public dateSubmitted: string, // not null
        public dateResolved: string,
        public description: string, // not null
        public resolver: User, // foreign key -> User
        public status: ReimbursementStatus, // foreign ey -> ReimbursementStatus, not null
        public type: ReimbursementType
    ) { }
}