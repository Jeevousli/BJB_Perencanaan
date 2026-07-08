import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByUsername } from './auth.repository';

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_default";

export const loginService = async (data: {
    username: string;
    password: string;
}) => {
    // cari user dari username
    const user = await findUserByUsername(data.username);
    if (!user) {
        throw new Error('Username atau password salah');
    }
    // cocokan password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
        throw new Error('Username atau password salah');
    }
    // generate JWT
    const token = jwt.sign({
        userId: user.id, role: user.role
    },
        JWT_SECRET, { expiresIn: '8h' }
    )
    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        }
    }
}