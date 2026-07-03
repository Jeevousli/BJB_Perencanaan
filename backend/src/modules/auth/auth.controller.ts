import { Request, Response } from 'express';
import { loginService } from './auth.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const login = async (req: Request, res: Response) => {
    try {
        const {
            email, password
        } = req.body;

        const result = await loginService({ email, password });

        res.status(200).json({
            message: 'Login Berhasil',
            data: result,
        })
    } catch (error: any) {
        res.status(401).json({
            message: error.message
        })

    }
}

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        // req.user diisi oleh middleware authJWT tadi
        const user = req.user;
        if (!user) {
            res.status(404).json({ message: 'User tidak ditemukan' });
            return;
        }
        res.status(200).json({ message: 'Data user berhasil diambil', data: user })
    } catch (error: any) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server' })
    }
}