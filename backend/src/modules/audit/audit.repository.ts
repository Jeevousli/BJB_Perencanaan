import prisma from '../../config/database';

export interface AuditEntry {
    id: string;
    action: 'CREATE' | 'UPDATE';
    entity: 'Document' | 'Banner' | 'CategoryBanner' | 'Category' | 'SubCategory';
    entityName: string;
    actor: string;
    timestamp: Date;
}

/**
 * Mengambil audit log gabungan dari semua tabel yang memiliki audit trail.
 * Menggabungkan data dari: Document, MasterBeranda, CategoryBanner, Category, SubCategory.
 * Mengurutkan berdasarkan waktu terbaru.
 */
export const getAuditLog = async (limit?: number): Promise<AuditEntry[]> => {
    // 1. Dokumen yang dibuat (CREATE) dan diperbarui (UPDATE)
    const documents = await prisma.document.findMany({
        select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
            uploader: { select: { username: true } },
            updatedBy: { select: { username: true } },
        },
        orderBy: { updatedAt: 'desc' },
        take: limit ? limit * 2 : 100,
    });

    // 2. Banner Beranda
    const banners = await prisma.masterBeranda.findMany({
        select: {
            id: true,
            judul: true,
            createdAt: true,
            updatedAt: true,
            createdBy: { select: { username: true } },
            updatedBy: { select: { username: true } },
        },
        orderBy: { updatedAt: 'desc' },
        take: limit ? limit * 2 : 50,
    });

    // 3. Banner Kategori
    const categoryBanners = await prisma.categoryBanner.findMany({
        select: {
            id: true,
            judul: true,
            createdAt: true,
            updatedAt: true,
            category: { select: { name: true } },
            subCategory: { select: { name: true } },
            createdBy: { select: { username: true } },
            updatedBy: { select: { username: true } },
        },
        orderBy: { updatedAt: 'desc' },
        take: limit ? limit * 2 : 50,
    });

    // 4. Kategori
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            createdBy: { select: { username: true } },
            updatedBy: { select: { username: true } },
        },
        orderBy: { updatedAt: 'desc' },
        take: limit ? limit * 2 : 50,
    });

    // 5. Sub Kategori
    const subCategories = await prisma.subCategory.findMany({
        select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            createdBy: { select: { username: true } },
            updatedBy: { select: { username: true } },
        },
        orderBy: { updatedAt: 'desc' },
        take: limit ? limit * 2 : 50,
    });

    // --- Gabungkan semua menjadi array AuditEntry[] ---
    const entries: AuditEntry[] = [];

    // Dokumen: CREATE & UPDATE
    for (const doc of documents) {
        // Selalu ada entri CREATE
        entries.push({
            id: `doc-create-${doc.id}`,
            action: 'CREATE',
            entity: 'Document',
            entityName: doc.title,
            actor: doc.uploader?.username || 'System',
            timestamp: doc.createdAt,
        });

        // Jika pernah diupdate oleh seseorang (dan waktunya berbeda dari created)
        if (doc.updatedBy && doc.updatedAt.getTime() !== doc.createdAt.getTime()) {
            entries.push({
                id: `doc-update-${doc.id}`,
                action: 'UPDATE',
                entity: 'Document',
                entityName: doc.title,
                actor: doc.updatedBy.username,
                timestamp: doc.updatedAt,
            });
        }
    }

    // Banner Beranda: CREATE & UPDATE
    for (const banner of banners) {
        entries.push({
            id: `banner-create-${banner.id}`,
            action: 'CREATE',
            entity: 'Banner',
            entityName: banner.judul,
            actor: banner.createdBy?.username || 'System',
            timestamp: banner.createdAt,
        });
        if (banner.updatedBy && banner.updatedAt.getTime() !== banner.createdAt.getTime()) {
            entries.push({
                id: `banner-update-${banner.id}`,
                action: 'UPDATE',
                entity: 'Banner',
                entityName: banner.judul,
                actor: banner.updatedBy.username,
                timestamp: banner.updatedAt,
            });
        }
    }

    // Banner Kategori: CREATE
    for (const cb of categoryBanners) {
        const parentName = cb.category?.name || cb.subCategory?.name || 'Unknown';
        entries.push({
            id: `catbanner-create-${cb.id}`,
            action: 'CREATE',
            entity: 'CategoryBanner',
            entityName: `${cb.judul} (${parentName})`,
            actor: cb.createdBy?.username || 'System',
            timestamp: cb.createdAt,
        });
    }

    // Kategori: UPDATE
    for (const cat of categories) {
        if (cat.updatedBy && cat.updatedAt.getTime() !== cat.createdAt.getTime()) {
            entries.push({
                id: `cat-update-${cat.id}`,
                action: 'UPDATE',
                entity: 'Category',
                entityName: cat.name,
                actor: cat.updatedBy.username,
                timestamp: cat.updatedAt,
            });
        }
    }

    // Sub Kategori: UPDATE
    for (const sub of subCategories) {
        if (sub.updatedBy && sub.updatedAt.getTime() !== sub.createdAt.getTime()) {
            entries.push({
                id: `sub-update-${sub.id}`,
                action: 'UPDATE',
                entity: 'SubCategory',
                entityName: sub.name,
                actor: sub.updatedBy.username,
                timestamp: sub.updatedAt,
            });
        }
    }

    // Urutkan berdasarkan timestamp terbaru
    entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Batasi jumlah jika diminta
    return limit ? entries.slice(0, limit) : entries;
};
