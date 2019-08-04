import { Reimbursement } from '../models/reimbursement';
import { User } from '../models/user';
import { Role } from '../models/role';
import { ReimbursementStatus } from '../models/reimbursement-status';
import { ReimbursementType } from '../models/reimbursement-type';


export function convertReimbursement(row: any) {
    return new Reimbursement(row.reimbursementid,
        new User(row.author, row.author_username, row.author_password && '', row.author_firstname, row.author_lastname, row.author_email,
            row.author_roleid && new Role(row.author_roleid, row.author_role)), row.amount, new Date(row.datesubmitted).toDateString(), new Date(row.dateresolved).toDateString(), row.description,
        row.resolver && new User(row.resolver, row.resolver_username, row.resolver_password && '', row.resolver_firstname, row.resolver_lastname, row.resolver_email,
            new Role(row.resolver_roleid, row.resolver_role)),
        new ReimbursementStatus(row.statusid, row.status), row.typeid && new ReimbursementType(row.typeid, row.type_name), row.total_row);
}