import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail } from './auth.repository';

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_default";

export const loginService = async (data: {
    email: string;
    password: string;
}) => {
    // cari user dari email
    const user = await findUserByEmail(data.email);
    if (!user) {
        throw new Error('Email atau password salah');
    }
    // cocokan password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
        throw new Error('Email atau password salah');
    }
    // generate JWT
    const token = jwt.sign({
        userId: user.id, role: user.role
    },
        JWT_SECRET, { expiresIn: '8h' }
    )
    return { token, role: user.role, }
}