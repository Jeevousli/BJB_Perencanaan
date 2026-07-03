import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "rahasia_default";

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
    //ambil token dr header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
        return;
    }

    // ambil token nya saja pishakan dari bearer'
    const token = authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Akses ditolak. Token tidak valid.' })
        return;
    }

    // verifikais tiken menggunakan secret key kita

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // simpan data payload user ke dalam req agar bisa di baca controller
        req.user = decoded;
        // lanjut ke controller
        next();
    } catch (error) {
        res.status(403).json({
            message: 'Token tidak valid atau sudah kadaluarsa'
        })
        return;
    }
};
// cek apaakah user mmeiliki role tertentu
export const authorizeRole = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        const user = req.user;
        if (!user) {
            res.status(401).json({
                message: 'Akses ditolak. Anda belum login'
            })
            return;
        }
        // cek apakah role itu ada
        if (!roles.includes(user.role)) {
            res.status(403).json({
                message: 'Akses ditolak. Anda tidak memiliki izin untuk halaman ini.'
            })
            return;
        }
        // jika sesuai bsia dilanjut
        next();
    }
}