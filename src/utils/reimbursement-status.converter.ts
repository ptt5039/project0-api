import { ReimbursementStatus } from '../models/reimbursement-status';

export function statusConverter(row: any) {
    return new ReimbursementStatus(row.statusid, row.status);
}