
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: {
            email: true,
            role: true,
            fullName: true
        }
    });
    console.log('--- USERS IN DATABASE ---');
    users.forEach(u => {
        console.log(`Email: ${u.email} | Role: ${u.role} | Name: ${u.fullName}`);
    });
    console.log('-------------------------');
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
