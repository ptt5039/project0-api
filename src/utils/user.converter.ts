import { User } from '../models/user';
import { Role } from '../models/role';

export function convertUser(row) {
    return new User(row.userid, row.username, row.pass, row.firstname, row.lastname, row.email,
        row.roleid && new Role(row.roleid, row.role_name));
}