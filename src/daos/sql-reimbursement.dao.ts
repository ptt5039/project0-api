import { PoolClient } from 'pg';
import { connectionPool } from '../utils/connection.util';
import { convertReimbursement } from '../utils/reimbursement.converter';
import { Reimbursement } from '../models/reimbursement';
import { typeConverter } from '../utils/reimbursement-type.converter';
import { statusConverter } from '../utils/reimbursement-status.converter';

export async function findReimbursementByStatusId(req) {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const queryString = `
            SELECT reimbursement_view.*, COUNT(*) OVER() AS total_row FROM reimbursement_view
                    WHERE statusid = $1
                    ORDER BY datesubmitted
                    LIMIT $2
                    OFFSET $3
            `;
        const result = await client.query(queryString, [req.params.statusId, req.query.limit, req.query.offset]);
        console.log(result);
        return result && result.rows.map(convertReimbursement);
    } catch (err) {
        console.log(err);
    } finally {
        client && client.release();
    }
    return undefined;
}

export async function findReimbursementByUserId(userId: number) {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const queryString = `
            SELECT * FROM reimbursement_view
                WHERE author = $1
                ORDER BY datesubmitted
            `;
        const result = await client.query(queryString, [userId]);
        return result && result.rows.map(convertReimbursement);
    } catch (err) {
        console.log(err);
    } finally {
        client && client.release();
    }
    return undefined;
}

export async function findReimbursementById(id: number) {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const queryString = `
            SELECT * FROM reimbursement_view
                WHERE reimbursementid = $1
            `;
        const result = await client.query(queryString, [id]);
        const sqlReimbursement = result.rows[0];
        return convertReimbursement(sqlReimbursement);
    } catch (err) {
        console.log(err);
    } finally {
        client && client.release();
    }
    return undefined;
}

export async function createReimbursement(reimbursement: Reimbursement) {
    let client: PoolClient;
    reimbursement.dateSubmitted = new Date().toUTCString();
    reimbursement.status.statusId = 1;
    try {
        client = await connectionPool.connect();
        const queryString = `
            INSERT INTO reimbursement (amount, author, resolver, datesubmitted, dateresolved, description, statusid, typeid)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
        `;
        const result = await client.query(queryString, [reimbursement.amount, reimbursement.author.userId, reimbursement.resolver && reimbursement.resolver.userId,
        reimbursement.dateSubmitted, reimbursement.dateResolved, reimbursement.description, reimbursement.status.statusId, reimbursement.type && reimbursement.type.typeId]);
        const sqlReimbursement = result.rows[0];
        return convertReimbursement(sqlReimbursement);
    } catch (error) {
        console.log(error);
    } finally {
        client && client.release();
    }
    return undefined;
}

export async function updateReimbursement(reimbursement: Partial<Reimbursement>) {
    const oldReimbursement = await findReimbursementById(reimbursement.reimbursementId);
    if (!oldReimbursement) {
        return undefined;
    }
    reimbursement = {
        ...oldReimbursement,
        ...reimbursement
    };
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const queryString = `
            UPDATE reimbursement SET amount = $1, author = $2, resolver = $3, datesubmitted = $4, dateresolved = $5,
                                    description = $6, statusid = $7, typeid = $8
                WHERE reimbursementid = $9
                RETURNING *
        `;
        const result = await client.query(queryString,
            [reimbursement.amount, reimbursement.author.userId, reimbursement.resolver && reimbursement.resolver.userId,
            reimbursement.dateSubmitted, reimbursement.dateResolved, reimbursement.description, reimbursement.status.statusId,
            reimbursement.type && reimbursement.type.typeId, reimbursement.reimbursementId]);
        const sqlReimbursement = result.rows[0];
        return convertReimbursement(sqlReimbursement);
    } catch (error) {
        console.log(error);
    } finally {
        client && client.release();
    }
    return undefined;
}

export async function getType() {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const queryString = `
            SELECT * FROM reimbursement_type
        `;
        const result = await client.query(queryString);
        return result && result.rows.map(typeConverter);
    } catch (err) {
        console.log(err);
    } finally {
        client && client.release();
    }
    return undefined;
}

export async function getStatus() {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        const queryString = `
            SELECT * FROM reimbursement_status
        `;
        const result = await client.query(queryString);
        return result && result.rows.map(statusConverter);
    } catch (err) {
        console.log(err);
    } finally {
        client && client.release();
    }
    return undefined;
}