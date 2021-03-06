import { Connection } from 'typeorm';
import { Tenant } from './tenant.entity';
import * as faker from 'faker';

export const getDefaultTenant = async (
	connection: Connection
): Promise<Tenant> => {
	const repo = connection.getRepository(Tenant);
	const existedTenant = await repo.findOne({ where: { name: 'Ever' } });
	return existedTenant;
};

export const createDefaultTenants = async (
	connection: Connection
): Promise<Tenant> => {
	const tenant: Tenant = {
		name: 'Ever'
	};
	await insertTenant(connection, tenant);
	return tenant;
};

export const createRandomTenants = async (
	connection: Connection,
	noOfTenants: number = 0
): Promise<Tenant[]> => {
	const randomTenants: Tenant[] = [];
	for (let i = 0; i < noOfTenants; i++) {
		randomTenants.push({
			name: faker.company.companyName()
		});
	}

	await insertTenants(connection, randomTenants);
	return randomTenants;
};

const insertTenant = async (
	connection: Connection,
	tenant: Tenant
): Promise<Tenant> => {
	const repo = connection.getRepository(Tenant);

	const existedTenant = await repo.findOne({ where: { name: tenant.name } });

	if (existedTenant) return existedTenant;
	else {
		await connection
			.createQueryBuilder()
			.insert()
			.into(Tenant)
			.values(tenant)
			.execute();

		return tenant;
	}
};

const insertTenants = async (
	connection: Connection,
	tenants: Tenant[]
): Promise<void> => {
	await connection
		.createQueryBuilder()
		.insert()
		.into(Tenant)
		.values(tenants)
		.execute();
};
