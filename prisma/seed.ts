import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.callAnalytic.deleteMany();
  await prisma.toneAssignment.deleteMany();
  await prisma.telecomLine.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.tone.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // Hash passwords
  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const managerPassword = await bcrypt.hash("Manager@123", 12);
  const clientPassword = await bcrypt.hash("Client@123", 12);

  // Create Organization
  const org = await prisma.organization.create({
    data: {
      name: "TunePoa Demo Corp",
      email: "info@tunepoademo.com",
      phone: "+255 700 123 456",
      address: "123 Ohio Street",
      city: "Dar es Salaam",
      country: "Tanzania",
      website: "https://tunepoademo.com",
    },
  });

  // Create Users
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@tunepoa.com",
      password: adminPassword,
      role: "ADMIN",
      isActive: true,
      organizationId: org.id,
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: "Manager User",
      email: "manager@tunepoa.com",
      password: managerPassword,
      role: "MANAGER",
      isActive: true,
      organizationId: org.id,
    },
  });

  const client = await prisma.user.create({
    data: {
      name: "Demo Client",
      email: "client@tunepoa.com",
      password: clientPassword,
      phone: "+255 712 345 678",
      role: "CLIENT",
      isActive: true,
      organizationId: org.id,
    },
  });

  console.log("✅ Users created");

  // Create Tones
  const tones = await Promise.all([
    prisma.tone.create({
      data: {
        name: "Corporate Elegance",
        description: "A professional, sophisticated tone perfect for corporate environments. Smooth jazz-inspired melody with subtle instrumentals.",
        category: "CORPORATE",
        status: "APPROVED",
        duration: 30,
        isPremium: false,
        plays: 15420,
        createdById: admin.id,
      },
    }),
    prisma.tone.create({
      data: {
        name: "Welcome to Paradise",
        description: "Upbeat tropical melody ideal for hospitality businesses. Features steel drum and calypso rhythms.",
        category: "HOSPITALITY",
        status: "APPROVED",
        duration: 25,
        isPremium: true,
        plays: 23150,
        createdById: admin.id,
      },
    }),
    prisma.tone.create({
      data: {
        name: "Shopping Groove",
        description: "Light, catchy pop melody that keeps callers engaged while they wait. Perfect for retail businesses.",
        category: "RETAIL",
        status: "APPROVED",
        duration: 30,
        isPremium: false,
        plays: 8970,
        createdById: admin.id,
      },
    }),
    prisma.tone.create({
      data: {
        name: "Healing Harmony",
        description: "Calm, soothing instrumental piece with gentle piano and strings. Designed for healthcare facilities.",
        category: "HEALTHCARE",
        status: "APPROVED",
        duration: 35,
        isPremium: true,
        plays: 12300,
        createdById: admin.id,
      },
    }),
    prisma.tone.create({
      data: {
        name: "Trust & Security",
        description: "Steady, reassuring melody conveying reliability and trust. Ideal for financial institutions.",
        category: "FINANCE",
        status: "APPROVED",
        duration: 30,
        isPremium: true,
        plays: 18700,
        createdById: admin.id,
      },
    }),
    prisma.tone.create({
      data: {
        name: "Knowledge Journey",
        description: "Inspiring, forward-looking melody with academic undertones. Great for educational institutions.",
        category: "EDUCATION",
        status: "APPROVED",
        duration: 25,
        isPremium: false,
        plays: 5400,
        createdById: admin.id,
      },
    }),
    prisma.tone.create({
      data: {
        name: "Afrobeat Vibes",
        description: "Energetic Afrobeat rhythm with modern production. Perfect for entertainment and media companies.",
        category: "ENTERTAINMENT",
        status: "APPROVED",
        duration: 30,
        isPremium: false,
        plays: 31200,
        createdById: admin.id,
      },
    }),
    prisma.tone.create({
      data: {
        name: "Peaceful Devotion",
        description: "Gentle, spiritual melody with choir undertones. Suitable for religious organizations.",
        category: "RELIGIOUS",
        status: "APPROVED",
        duration: 35,
        isPremium: false,
        plays: 7800,
        createdById: admin.id,
      },
    }),
    prisma.tone.create({
      data: {
        name: "Public Service",
        description: "Official, dignified tone for government offices. Professional and respectful.",
        category: "GOVERNMENT",
        status: "APPROVED",
        duration: 30,
        isPremium: false,
        plays: 4200,
        createdById: admin.id,
      },
    }),
    prisma.tone.create({
      data: {
        name: "Brand Signature",
        description: "Custom branded tone template with space for voice-over and brand messaging. Premium offering.",
        category: "CUSTOM",
        status: "APPROVED",
        duration: 40,
        isPremium: true,
        plays: 27600,
        createdById: admin.id,
      },
    }),
    prisma.tone.create({
      data: {
        name: "Swahili Breeze",
        description: "Traditional Taarab-inspired melody with modern production. Celebrating East African musical heritage.",
        category: "HOSPITALITY",
        status: "APPROVED",
        duration: 28,
        isPremium: false,
        plays: 19800,
        createdById: admin.id,
      },
    }),
    prisma.tone.create({
      data: {
        name: "Seasonal Greetings",
        description: "Festive holiday tone with warm, celebratory vibes. Great for seasonal campaigns.",
        category: "CUSTOM",
        status: "DRAFT",
        duration: 30,
        isPremium: true,
        plays: 9500,
        createdById: manager.id,
      },
    }),
  ]);

  console.log("✅ Tones created");

  // Create Telecom Lines for the client
  const lines = await Promise.all([
    prisma.telecomLine.create({
      data: {
        number: "+255 712 345 678",
        provider: "VODACOM",
        status: "ACTIVE",
        label: "Main Business Line",
        activatedAt: new Date("2024-01-15"),
        userId: client.id,
        organizationId: org.id,
      },
    }),
    prisma.telecomLine.create({
      data: {
        number: "+255 723 456 789",
        provider: "AIRTEL",
        status: "ACTIVE",
        label: "Customer Support",
        activatedAt: new Date("2024-02-01"),
        userId: client.id,
        organizationId: org.id,
      },
    }),
    prisma.telecomLine.create({
      data: {
        number: "+255 734 567 890",
        provider: "SAFARICOM",
        status: "ACTIVE",
        label: "Sales Line",
        activatedAt: new Date("2024-03-10"),
        userId: client.id,
        organizationId: org.id,
      },
    }),
  ]);

  console.log("✅ Telecom lines created");

  // Create Tone Assignments
  await Promise.all([
    prisma.toneAssignment.create({
      data: {
        toneId: tones[0].id,
        userId: client.id,
        telecomLineId: lines[0].id,
        isActive: true,
      },
    }),
    prisma.toneAssignment.create({
      data: {
        toneId: tones[1].id,
        userId: client.id,
        telecomLineId: lines[1].id,
        isActive: true,
      },
    }),
    prisma.toneAssignment.create({
      data: {
        toneId: tones[6].id,
        userId: client.id,
        telecomLineId: lines[2].id,
        isActive: true,
      },
    }),
  ]);

  console.log("✅ Tone assignments created");

  // Create Subscription for client
  await prisma.subscription.create({
    data: {
      userId: client.id,
      planType: "PRO",
      status: "ACTIVE",
      billingPeriod: "MONTHLY",
      amount: 57000,
      maxUsers: 3,
      maxLines: 5,
      currentPeriodStart: new Date("2024-12-01"),
      currentPeriodEnd: new Date("2025-01-01"),
      organizationId: org.id,
    },
  });

  console.log("✅ Subscription created");

  // Create Call Analytics (last 30 days)
  const analyticsData = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    for (const line of lines) {
      const baseCalls = line.provider === "VODACOM" ? 450 : line.provider === "AIRTEL" ? 320 : 280;
      const totalCalls = baseCalls + Math.floor(Math.random() * 200);
      const avgWaitTime = 15 + Math.floor(Math.random() * 25);
      const retentionRate = 75 + Math.random() * 20;
      const peakHour = 9 + Math.floor(Math.random() * 6);

      analyticsData.push(
        prisma.callAnalytic.create({
          data: {
            telecomLineId: line.id,
            date: date,
            totalCalls,
            avgWaitTime,
            retentionRate: Math.round(retentionRate * 10) / 10,
            peakHour,
          },
        })
      );
    }
  }

  await Promise.all(analyticsData);

  console.log("✅ Call analytics created");

  // Create Activities
  const activities = [
    { type: "USER_CREATED" as const, description: "Account created successfully", userId: client.id },
    { type: "LOGIN" as const, description: "Logged in from Dar es Salaam, Tanzania", userId: client.id },
    { type: "TONE_ASSIGNED" as const, description: "Assigned 'Corporate Elegance' to Main Business Line", userId: client.id },
    { type: "TONE_ASSIGNED" as const, description: "Assigned 'Welcome to Paradise' to Customer Support Line", userId: client.id },
    { type: "LINE_ACTIVATED" as const, description: "Activated Vodacom line +255 712 345 678", userId: client.id },
    { type: "LINE_ACTIVATED" as const, description: "Activated Airtel line +255 723 456 789", userId: client.id },
    { type: "PLAN_UPGRADED" as const, description: "Upgraded from Starter to Pro plan", userId: client.id },
    { type: "LOGIN" as const, description: "Logged in from mobile device", userId: client.id },
    { type: "TONE_ASSIGNED" as const, description: "Assigned 'Afrobeat Vibes' to Sales Line", userId: client.id },
    { type: "PROFILE_UPDATED" as const, description: "Updated profile information", userId: client.id },
    { type: "LOGIN" as const, description: "Admin panel accessed", userId: admin.id },
    { type: "USER_CREATED" as const, description: "Created manager account", userId: admin.id },
  ];

  for (const activity of activities) {
    await prisma.activity.create({ data: activity });
  }

  console.log("✅ Activities created");

  // Create Platform Settings
  const settings = [
    { key: "platform_name", value: "TunePoa" },
    { key: "platform_tagline", value: "Professional Ringback Tone Solution" },
    { key: "default_trial_days", value: "14" },
    { key: "starter_price_monthly", value: "20000" },
    { key: "pro_price_monthly", value: "57000" },
    { key: "starter_max_lines", value: "1" },
    { key: "pro_max_lines", value: "5" },
    { key: "enterprise_max_lines", value: "unlimited" },
    { key: "support_email", value: "support@tunepoa.com" },
    { key: "support_phone", value: "+255 700 000 000" },
    { key: "maintenance_mode", value: "false" },
    { key: "max_tone_duration_seconds", value: "60" },
    { key: "default_currency", value: "TZS" },
  ];

  for (const setting of settings) {
    await prisma.setting.create({ data: setting });
  }

  console.log("✅ Settings created");

  console.log("\n🎉 Seeding completed!");
  console.log("\n📋 Demo Accounts:");
  console.log("   Admin:   admin@tunepoa.com / Admin@123");
  console.log("   Manager: manager@tunepoa.com / Manager@123");
  console.log("   Client:  client@tunepoa.com / Client@123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
