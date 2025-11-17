import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1️⃣ Créer un utilisateur
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: '123456',
      role: 'donateur',
    },
  });
  console.log('Utilisateur créé :', user);

  // 2️⃣ Créer un don pour cet utilisateur
  const donation = await prisma.donation.create({
    data: {
      amount: 50,
      userId: user.id,
    },
  });
  console.log('Donation créée :', donation);

  // 3️⃣ Récupérer tous les utilisateurs avec leurs dons
  const usersWithDonations = await prisma.user.findMany({
    include: { donations: true },
  });
  console.log('Tous les utilisateurs avec leurs dons :', usersWithDonations);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
