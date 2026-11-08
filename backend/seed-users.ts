
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedUsers() {
    try {
        console.log('🌱 Starting to seed users...');

        // إنشاء حساب سارة (مستخدم عادي)
        const saraPassword = await bcrypt.hash('password123', 10);
        const sara = await prisma.user.upsert({
            where: { email: 'sara@example.com' },
            update: { password: saraPassword },
            create: {
                email: 'sara@example.com',
                password: saraPassword,
                fullName: 'Sara Ahmed',
                role: 'USER',
                isVerified: true,
            },
        });
        console.log('✅ Sara user created/updated:', sara.email);

        // إنشاء حساب أحمد (مالك عقار)
        const ahmedPassword = await bcrypt.hash('password123', 10);
        const ahmed = await prisma.user.upsert({
            where: { email: 'ahmed@example.com' },
            update: { password: ahmedPassword },
            create: {
                email: 'ahmed@example.com',
                password: ahmedPassword,
                fullName: 'Ahmed Mohamed',
                role: 'LANDLORD',
                isVerified: true,
            },
        });
        console.log('✅ Ahmed (Landlord) user created/updated:', ahmed.email);

        // إنشاء حساب الأدمن
        const adminPassword = await bcrypt.hash('admin123', 10);
        const admin = await prisma.user.upsert({
            where: { email: 'admin@example.com' },
            update: { password: adminPassword },
            create: {
                email: 'admin@example.com',
                password: adminPassword,
                fullName: 'System Admin',
                role: 'ADMIN',
                isVerified: true,
            },
        });
        console.log('✅ Admin user created/updated:', admin.email);

        console.log('🎉 All users seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedUsers();
