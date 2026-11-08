import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Hash password
  const passwordHash = await bcrypt.hash('123456', 10);

  // ─── Demo Users ────────────────────────────────────────────────────────────
  const tourist = await prisma.user.upsert({
    where: { email: 'tourist1@test.com' },
    update: {},
    create: {
      email: 'tourist1@test.com',
      password: passwordHash,
      fullName: 'Ahmed Al-Sayed',
      role: 'USER',
      purpose: 'TOURIST',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tourist1',
      bio: 'Travel enthusiast exploring Egypt.',
      isVerified: true,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student1@test.com' },
    update: {},
    create: {
      email: 'student1@test.com',
      password: passwordHash,
      fullName: 'Nour Hassan',
      role: 'USER',
      purpose: 'STUDENT',
      university: 'Cairo University',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student1',
      bio: 'CS student looking for a quiet place near campus.',
      isVerified: true,
    },
  });

  const landlord = await prisma.user.upsert({
    where: { email: 'landlord1@test.com' },
    update: {},
    create: {
      email: 'landlord1@test.com',
      password: passwordHash,
      fullName: 'Mohamed Farouk',
      role: 'LANDLORD',
      purpose: 'BOTH',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=landlord1',
      bio: 'Property manager with 10+ years in Cairo real estate.',
      phoneNumber: '01012345678',
      isVerified: true,
    },
  });

  const landlord2 = await prisma.user.upsert({
    where: { email: 'landlord2@test.com' },
    update: {},
    create: {
      email: 'landlord2@test.com',
      password: passwordHash,
      fullName: 'Sara Mahmoud',
      role: 'LANDLORD',
      purpose: 'BOTH',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=landlord2',
      bio: 'Hosting luxury stays in Sharm El-Sheikh & Hurghada since 2018.',
      phoneNumber: '01098765432',
      isVerified: true,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@roommates.com' },
    update: {},
    create: {
      email: 'admin@roommates.com',
      password: passwordHash,
      fullName: 'Admin Roommates',
      role: 'ADMIN',
      purpose: 'BOTH',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      isVerified: true,
    },
  });

  console.log('✅ Users created:', { tourist: tourist.email, student: student.email, landlord: landlord.email, admin: adminUser.email });

  // ─── Vacation Rental Listings ───────────────────────────────────────────────
  const vacationListings = [
    {
      title: 'Luxury Nile View Suite — Zamalek',
      description: `Experience Cairo from the heart of the Nile. This stunning suite in Zamalek offers breathtaking river views, luxurious furnishings, and a location within walking distance of top restaurants and cultural landmarks.\n\n✅ Entire apartment to yourself\n✅ Daily cleaning service\n✅ High-speed WiFi & Smart TV\n✅ 24/7 security & concierge\n✅ 5 min walk to Cairo Tower`,
      price: 1800,
      dailyPrice: 1800,
      monthlyPrice: 36000,
      address: 'Zamalek, Cairo',
      latitude: 30.0626,
      longitude: 31.2195,
      roomType: 'studio',
      size: 65,
      maxGuests: 2,
      amenities: JSON.stringify(['WiFi', 'AC', 'Balcony', 'Elevator', 'Parking']),
      images: [
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&auto=format&fit=crop',
      ],
      ownerId: landlord.id,
    },
    {
      title: 'Bohemian Studio in Historic Islamic Cairo',
      description: `Stay in the soul of Egypt. This charming studio is steps away from Khan El-Khalili bazaar and Al-Azhar Mosque. Fully equipped with authentic Egyptian décor, it's the perfect base for cultural explorers.\n\n🕌 Walk to Khan El-Khalili (3 min)\n🎨 Artist-designed interior\n📸 Perfect Instagram backdrop\n☕ Rooftop terrace with city views`,
      price: 950,
      dailyPrice: 950,
      monthlyPrice: 19000,
      address: 'Islamic Cairo, Cairo',
      latitude: 30.046,
      longitude: 31.263,
      roomType: 'studio',
      size: 40,
      maxGuests: 2,
      amenities: JSON.stringify(['WiFi', 'AC', 'Heating']),
      images: [
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop',
      ],
      ownerId: landlord.id,
    },
    {
      title: 'Beachfront Chalet — Sharm El-Sheikh',
      description: `Wake up to Red Sea sunrises from your private balcony. This stunning beachfront chalet in Sharm El-Sheikh combines luxury and nature in one package.\n\n🌊 Direct beach access\n🤿 Free snorkeling gear\n🏊 Private pool & spa access\n🐠 Coral reef 50m away\n🍽️ Breakfast included`,
      price: 2200,
      dailyPrice: 2200,
      monthlyPrice: 44000,
      address: 'Naama Bay, Sharm El-Sheikh',
      latitude: 27.912,
      longitude: 34.326,
      roomType: 'private',
      size: 80,
      maxGuests: 4,
      amenities: JSON.stringify(['WiFi', 'AC', 'Pool', 'Balcony', 'Parking', 'Gym']),
      images: [
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=900&auto=format&fit=crop',
      ],
      ownerId: landlord2.id,
    },
    {
      title: 'Modern Sea-View Apartment — Hurghada Marina',
      description: `Located right at Hurghada Marina, this modern apartment is a paradise for beach lovers. Watch boats sail by from your living room and fall asleep to the sound of waves.\n\n⛵ Marina & yacht access\n🌅 Unobstructed sea view\n🎯 Senzo Mall (5 min drive)\n✈️ 20 min from airport\n🛡️ 24/7 gated community security`,
      price: 1600,
      dailyPrice: 1600,
      monthlyPrice: 32000,
      address: 'Hurghada Marina, Hurghada',
      latitude: 27.257,
      longitude: 33.812,
      roomType: 'private',
      size: 90,
      maxGuests: 6,
      amenities: JSON.stringify(['WiFi', 'AC', 'Balcony', 'Pool', 'Parking', 'Gym', 'Elevator']),
      images: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1527030280862-64139fba04ca?w=900&auto=format&fit=crop',
      ],
      ownerId: landlord2.id,
    },
    {
      title: 'Cozy Old-Town Apartment — Alexandria Corniche',
      description: `Experience Alexandria like a local. This charming apartment on the famous Corniche offers sweeping Mediterranean Sea views and easy access to Montaza Palace Gardens and Stanley Bridge.\n\n🏛️ 10 min to Bibliotheca Alexandrina\n🌊 Mediterranean Sea view\n🚶 Walk to Stanley Beach\n🍝 Local seafood restaurants next door`,
      price: 1100,
      dailyPrice: 1100,
      monthlyPrice: 22000,
      address: 'Corniche, Alexandria',
      latitude: 31.199,
      longitude: 29.919,
      roomType: 'private',
      size: 70,
      maxGuests: 4,
      amenities: JSON.stringify(['WiFi', 'AC', 'Balcony', 'Heating']),
      images: [
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&auto=format&fit=crop',
      ],
      ownerId: landlord.id,
    },
    {
      title: 'Desert Eco Lodge — Near Luxor Temple',
      description: `Immerse yourself in 5000 years of history. Steps from Luxor Temple, this authentically decorated eco-lodge offers an unforgettable experience with rooftop dining under the stars.\n\n🏺 Walking distance to Luxor Temple\n⭐ Rooftop star-gazing lounge\n🌅 Nile sunset views\n🚲 Bicycles provided\n🎭 Daily guided tours available`,
      price: 850,
      dailyPrice: 850,
      monthlyPrice: 17000,
      address: 'East Bank, Luxor',
      latitude: 25.699,
      longitude: 32.645,
      roomType: 'private',
      size: 45,
      maxGuests: 2,
      amenities: JSON.stringify(['WiFi', 'AC', 'Balcony']),
      images: [
        'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1576548374067-a87c40c7fe7b?w=900&auto=format&fit=crop',
      ],
      ownerId: landlord2.id,
    },
    {
      title: 'Penthouse with Pyramids View — Giza',
      description: `The ultimate Cairo bucket-list stay. This extraordinary penthouse apartment offers an unobstructed view of the Great Pyramids of Giza from the rooftop terrace. Watch the Sound & Light show from the comfort of your private space.\n\n🔺 Direct Pyramids view from rooftop\n✨ Sound & Light show visible\n🌟 Luxury furnishings throughout\n🚗 Free private car service to Sphinx\n📸 Perfect for photoshoots`,
      price: 3200,
      dailyPrice: 3200,
      monthlyPrice: 64000,
      address: 'Nazlet El-Samman, Giza',
      latitude: 29.974,
      longitude: 31.125,
      roomType: 'private',
      size: 120,
      maxGuests: 4,
      amenities: JSON.stringify(['WiFi', 'AC', 'Balcony', 'Parking', 'Elevator', 'Gym']),
      images: [
        'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=900&auto=format&fit=crop',
      ],
      ownerId: landlord.id,
    },
  ];

  // ─── Student Housing Listings ──────────────────────────────────────────────
  const studentListings = [
    {
      title: 'Private Room near Cairo University — Giza',
      description: 'Quiet private room in a 3-bedroom apartment shared with 2 other students. 5-minute walk to Cairo University Faculty of Engineering. All utilities included.',
      price: 2800,
      dailyPrice: null,
      monthlyPrice: 2800,
      address: 'Giza, near Cairo University',
      latitude: 30.026,
      longitude: 31.211,
      roomType: 'private',
      size: 18,
      maxGuests: 1,
      amenities: JSON.stringify(['WiFi', 'AC', 'Washer']),
      images: [
        'https://images.unsplash.com/photo-1555438736-b15d4f1e3b47?w=900&auto=format&fit=crop',
      ],
      ownerId: landlord.id,
    },
    {
      title: 'Furnished Studio — Near Ain Shams University',
      description: 'Fully furnished studio apartment, ideal for a single student. Close to Ain Shams University. Quiet building, dedicated study desk, high-speed internet.',
      price: 3500,
      dailyPrice: null,
      monthlyPrice: 3500,
      address: 'Abbassia, Cairo',
      latitude: 30.073,
      longitude: 31.297,
      roomType: 'studio',
      size: 30,
      maxGuests: 1,
      amenities: JSON.stringify(['WiFi', 'AC', 'Elevator']),
      images: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&auto=format&fit=crop',
      ],
      ownerId: landlord2.id,
    },
    {
      title: 'Shared Room — 2-Person, Nasr City',
      description: 'Budget-friendly shared room in a clean apartment. Two beds, good lighting, and study space. Ideal for students looking to save.',
      price: 1500,
      dailyPrice: null,
      monthlyPrice: 1500,
      address: 'Nasr City, Cairo',
      latitude: 30.057,
      longitude: 31.34,
      roomType: 'shared',
      size: 22,
      maxGuests: 2,
      amenities: JSON.stringify(['WiFi', 'AC']),
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&auto=format&fit=crop',
      ],
      ownerId: landlord.id,
    },
  ];

  // Clear old listings created by seed users only (avoid production data loss)
  const seedOwnerIds = [landlord.id, landlord2.id];

  for (const listingData of [...vacationListings, ...studentListings]) {
    const { images: imageUrls, ...listingFields } = listingData;

    const isVacation = listingData.dailyPrice !== null;

    const created = await prisma.listing.create({
      data: {
        ...listingFields,
        dailyPrice: listingData.dailyPrice ?? undefined,
        monthlyPrice: listingData.monthlyPrice ?? undefined,
        listingCategory: isVacation ? 'VACATION_RENTAL' : 'STUDENT_HOUSING',
        status: 'ACTIVE',
        viewsCount: Math.floor(Math.random() * 300 + 50),
        images: {
          create: imageUrls.map((url: string) => ({ url })),
        },
      },
    });
    console.log(`✅ Created listing: ${created.title}`);
  }

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📧 Demo Accounts:');
  console.log('  Tourist:  tourist1@test.com / 123456');
  console.log('  Student:  student1@test.com / 123456');
  console.log('  Landlord: landlord1@test.com / 123456');
  console.log('  Landlord: landlord2@test.com / 123456');
  console.log('  Admin:    admin@roommates.com / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
