import { PoolClient } from 'pg';
import { connectionPool } from '../utils/connection.util';
import { convertUser } from '../utils/user.converter';
import { User } from '../models/user';

export async function findByUsernameAndPassword(username: string, password: string) {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const queryString = `
                SELECT * FROM app_user
                    INNER JOIN user_role USING (roleid)
                    WHERE username = $1 AND pass = $2
        `;
        const result = await client.query(queryString, [username, password]);
        const sqlUser = result.rows[0];
        return sqlUser && convertUser(sqlUser);
    } catch (error) {
        console.log(error);
    } finally {
        client && client.release();
    }
    return undefined;
}

export async function findAll() {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const result = await client.query('SELECT * FROM app_user INNER JOIN user_role USING (roleid) ORDER BY userid');
        return result.rows.map(convertUser);
    } catch (err) {
        console.log(err);
    } finally {
        client && client.release();
    }
    return undefined;
}

export async function findById(id: number) {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const queryString = `
            SELECT * FROM app_user
                INNER JOIN user_role USING (roleid)
                WHERE userid = $1
        `;
        const result = await client.query(queryString, [id]);
        const sqlUser = result.rows[0];
        return sqlUser && convertUser(sqlUser);
    } catch (error) {
        console.log(error);
    } finally {
        client && client.release();
    }
    return undefined;
}

export async function updateUser(user: Partial<User>) {
    const oldUser = await findById(user.userId);
    if (!oldUser) {
        return undefined;
    }
    user = {
        ...oldUser,
        ...user
    };
    console.log(user);
    let client: PoolClient;
    try {
        client = await connectionPool.connect(); // basically .then is everything after this
        let queryString = '';
        let params = [];
        if (!user.password) {
            queryString = `
            UPDATE app_user SET username = $1, firstname = $2, lastname = $3, email = $4, roleid = $5
            WHERE userid = $6
            RETURNING *
        `;
            params = [user.username, user.firstName, user.lastName, user.email, user.role.roleId, user.userId];
        } else {
            queryString = `
            UPDATE app_user SET username = $1, pass = $2, firstname = $3, lastname = $4, email = $5, roleid = $6
            WHERE userid = $7
            RETURNING *`;
            params = [user.username, user.password, user.firstName, user.lastName, user.email, user.role.roleId, user.userId];
        }
        const result = await client.query(queryString, params);
        const sqlUser = result.rows[0];
        const newUser = convertUser(sqlUser);
        const userWithRole = await findById(newUser.userId);
        return userWithRole;
    } catch (err) {
        console.log(err);
    } finally {
        client && client.release();
    }
    return undefined;
}