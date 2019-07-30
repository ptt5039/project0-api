import { ReimbursementType } from '../models/reimbursement-type';

export function typeConverter(row: any) {
    return new ReimbursementType(row.typeid, row.type_name);
}