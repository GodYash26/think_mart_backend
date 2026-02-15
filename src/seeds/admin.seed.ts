import 'dotenv/config';
require('dotenv').config({ path: __dirname + '/../.env' });
import { DataSource } from 'typeorm';
import { User, UserRole } from '../auth/entities/auth.entity';
import * as bcrypt from 'bcrypt';

const AppDataSource = new DataSource({
    type: 'mongodb',
    url: process.env.MONGO_URI,
    entities: [User],
});


async function seedAdmin() {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(User);

    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@1234";

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const exist = await repo.findOne({ where: { email: adminEmail } });
    if (exist) {
        await AppDataSource.destroy();
        throw new Error(`Admin with email ${adminEmail} already exists`);
    }

    const adminUser = repo.create({
        fullname: 'Ganesh Admin',
        email: adminEmail,
        password: hashedPassword,
        phone: '9867564534',
        address: 'Kathmandu, Nepal',
        role: UserRole.ADMIN,

    });

    await repo.save(adminUser);
    await AppDataSource.destroy();
    console.log('Admin user created successfully');
}

seedAdmin().catch((err) => {
    console.error(err);
    process.exit(1);
});

