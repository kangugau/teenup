import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/teenup?schema=public',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean up existing data
  await prisma.subscription.deleteMany({});
  await prisma.classRegistration.deleteMany({});
  await prisma.class.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.parent.deleteMany({});

  // Create Parents
  const parent1 = await prisma.parent.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
    },
  });

  const parent2 = await prisma.parent.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '0987654321',
    },
  });

  // Create Students
  const student1 = await prisma.student.create({
    data: {
      name: 'Alice Doe',
      dob: new Date('2015-05-15'),
      gender: 'Female',
      currentGrade: '3',
      parentId: parent1.id,
    },
  });

  const student2 = await prisma.student.create({
    data: {
      name: 'Bob Doe',
      dob: new Date('2017-08-20'),
      gender: 'Male',
      currentGrade: '1',
      parentId: parent1.id,
    },
  });

  const student3 = await prisma.student.create({
    data: {
      name: 'Charlie Smith',
      dob: new Date('2014-02-10'),
      gender: 'Male',
      currentGrade: '4',
      parentId: parent2.id,
    },
  });

  // Create Classes
  const class1 = await prisma.class.create({
    data: {
      name: 'Math Basics',
      subject: 'Math',
      dayOfWeek: 'Monday',
      timeSlot: '15:00-16:00',
      teacherName: 'Mr. Newton',
      maxStudents: 10,
    },
  });

  const class2 = await prisma.class.create({
    data: {
      name: 'English Grammar',
      subject: 'English',
      dayOfWeek: 'Wednesday',
      timeSlot: '16:00-17:00',
      teacherName: 'Ms. Shakespeare',
      maxStudents: 15,
    },
  });

  // Create Class Registrations
  await prisma.classRegistration.create({
    data: {
      classId: class1.id,
      studentId: student1.id,
    },
  });

  await prisma.classRegistration.create({
    data: {
      classId: class1.id,
      studentId: student3.id,
    },
  });

  await prisma.classRegistration.create({
    data: {
      classId: class2.id,
      studentId: student2.id,
    },
  });

  // Create Subscriptions
  await prisma.subscription.create({
    data: {
      studentId: student1.id,
      packageName: 'Basic Math',
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      totalSessions: 4,
      usedSessions: 1,
    },
  });

  await prisma.subscription.create({
    data: {
      studentId: student2.id,
      packageName: 'Standard English',
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      totalSessions: 12,
      usedSessions: 0,
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
