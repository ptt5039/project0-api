import { Role } from '../models/role';

export function roleConverter(row: any) {
    return new Role(row.roleid, row.role_name);
}