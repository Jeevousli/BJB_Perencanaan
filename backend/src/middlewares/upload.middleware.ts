import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { error } from 'console';

// folder menyimpan file

const uploadDir = 'uploads/document';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
        recursive: true
    })
}
// konfigurasi penyimpanan dna penamaan file

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        // generate nama unik
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, 'document-' + uniqueSuffix + ext)
    }
})

// filter file 

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Hanya file PDF yang diizinkan'))
    }
}

// export fungsi upload, maksimal ukuran file 10mb

export const uploadPdf = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
})

// --- KONFIGURASI UNTUK BANNER (GAMBAR) ---

// 1. Buat folder khusus gambar (terpisah dari dokumen)
const uploadImageDir = 'uploads/banners';
if (!fs.existsSync(uploadImageDir)) {
    fs.mkdirSync(uploadImageDir, { recursive: true });
}

// 2. Konfigurasi penyimpanan gambar
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadImageDir);
    },
    filename: (req, file, cb) => {
        // Nama unik: banner-162384728.jpg
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'banner-' + uniqueSuffix + ext);
    }
});

// 3. Filter khusus Gambar (Tolak selain jpg, jpeg, png, webp)
const imageFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Array berisi daftar tipe file yang diizinkan
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar (JPG, PNG, WEBP) yang diizinkan!'));
    }
};

// 4. Export fungsi upload gambar, maksimal 5MB
export const uploadImage = multer({
    storage: imageStorage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB cukup untuk gambar
});
