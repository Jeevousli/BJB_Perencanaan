import express, { Request, Response } from 'express';
import prisma from './config/database';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import categoryRoutes from './modules/categories/categories.routes';
import documentRoutes from './modules/documents/documents.routes';
import bannerRoutes from './modules/banners/banners.routes';
import settingsRoutes from './modules/settings/settings.routes';
import auditRoutes from './modules/audit/audit.routes';
import path from 'path';
import cors from 'cors';

const app = express();
app.use(cors());
const port = process.env.PORT || 4000;

// Middleware untuk membaca JSON
app.use(express.json());
// Daftarkan semua route
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/audit', auditRoutes);




async function testDatabaseConnection() {
    try {
        console.log('> Menghubungkan ke database...');
        // Memanggil query sederhana untuk mengambil data user
        const users = await prisma.user.findMany();

        console.log('Koneksi Database Sukses! Total user ditemukan:', users.length);
    } catch (error) {
        console.error('Gagal koneksi ke database:', error);
    }
}

// Jalankan fungsi test koneksi
testDatabaseConnection();

// Contoh Route API backend
app.get('/api/halo', (req: Request, res: Response) => {
    res.json({ pesan: 'Halo dari backend BJB Project!' });
});

app.listen(port, () => {
    console.log(`> Server siap di http://localhost:${port}`);
});