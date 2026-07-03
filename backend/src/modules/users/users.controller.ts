import { Request, Response } from 'express';
import * as userService from './users.service';
import { json } from 'node:stream/consumers';

// ambil semua user
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({
            message: 'Berhasil mengambil data users',
            data: users
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        })
    }
}

// ambil user berdasarkan ID

export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        // ambil id dari url (api/user/134)
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: "Format ID tidak valid atau kosong!" });
        }
        const user = await userService.getUserById(id);
        res.status(200).json({
            message: 'Berhasil mengambil data user', data: user
        })
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        })
    }
}

// membuat user baru

export const createUser = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const newUser = await userService.createUser(data);
        res.status(201).json({ message: 'User berhasil dibuat', data: newUser })
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        })
    }
}

// Update user

export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const data = req.body;
        // Jika id tidak ada ATAU tipenya berupa object/array, tolak request-nya
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: "Format ID tidak valid atau kosong!" });
        }
        const updatedUser = await userService.updateUser(id, data);
        res.status(200).json({
            message: 'User berhasil di update', data: updatedUser
        })
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        })
    }
}

//hapus user

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        // Jika id tidak ada ATAU tipenya berupa object/array, tolak request-nya
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: "Format ID tidak valid atau kosong!" });
        }
        await userService.deleteUser(id);
        res.status(200).json({
            message: 'User berhasil dihapus'
        })

    } catch (error: any) {
        res.status(400).json({
            message: error.message
        })
    }
}