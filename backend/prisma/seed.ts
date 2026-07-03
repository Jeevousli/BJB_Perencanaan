import bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    // 1. Seed User Admin (yang lama)
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@bjb.co.id' },
        update: {},
        create: {
            username: 'Admin BJB',
            email: 'admin@bjb.co.id',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });
    console.log('✓ Seed Admin berhasil:', admin.email);

    // 2. Daftar Kategori FIX yang diminta
    const categoriesData = [
        {
            name: "Publikasi",
            subCategories: ["Daily Economic", "bjb Business Insight"]
        },
        {
            name: "Makroekonomi",
            subCategories: ["Macro Brief", "Ekonomi Makro"]
        },
        {
            name: "Industri",
            subCategories: ["Positioning", "Market Share", "Rasio Industri", "Kajian NPL"]
        },
        {
            name: "Regional",
            subCategories: ["Mapping Ekonomi", "Pemetaan Sektoral Ekonomi & Kredit Perbankan"]
        },
        {
            name: "Market Intelligence",
            subCategories: [] // Kosong karena tidak ada sub
        },
        {
            name: "Outlook Economic Forum",
            subCategories: []
        },
        {
            name: "Daily Market Dashboard",
            subCategories: []
        }
    ];

    console.log('> Mulai seeding kategori...');

    for (const cat of categoriesData) {
        // Upsert Kategori
        const category = await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: { name: cat.name }
        });

        // Insert Sub Kategorinya jika ada
        for (const subName of cat.subCategories) {
            // Karena SubCategory tidak punya field unik yang pasti, kita cek manual
            const existingSub = await prisma.subCategory.findFirst({
                where: { name: subName, categoryId: category.id }
            });

            if (!existingSub) {
                await prisma.subCategory.create({
                    data: {
                        name: subName,
                        categoryId: category.id
                    }
                });
            }
        }
    }

    console.log('✓ Seed Kategori & Sub Kategori selesai!');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
