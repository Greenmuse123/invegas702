import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@invegas702.com';
  const password = 'admin123'; // Change this to a secure password
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN',
      },
    });
    
    console.log('Admin user created successfully:', admin);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 