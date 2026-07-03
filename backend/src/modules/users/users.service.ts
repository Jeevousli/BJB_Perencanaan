import bcrypt from "bcryptjs";
import * as userRepository from './users.repository'


// ambil semua user
export const getAllUsers = async () => {
    return await
        userRepository.findAllUsers();
}

// ambil user berdasarkan id

export const getUserById = async (id: string) => {
    const user = await userRepository.findUserById(id);
    if (!user) {
        throw new Error('User tidak ditemukan.');
    }
    return user;
}

// membuat user baru [admin]

export const createUser = async (data: any) => {
    const existingUser = await userRepository.findAllUsers().then(users => users.find(u => u.username === data.username))
    if (existingUser) {
        throw new Error('Username sudah terdaftar');
    }
    //Hash password
    const hashedPasswod = await bcrypt.hash(data.password, 10);

    // ganti pw asli dengan pw yg di hash
    const newUserData = { ...data, password: hashedPasswod };
    return await userRepository.createUser(newUserData)
}

// Update User

export const updateUser = async (id: string, data: any) => {
    // cek apakah user nya ada
    await getUserById(id);

    // jika admin ganti pw user harus di hash lagi

    let updateData = { ...data };
    if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
    }
    return await userRepository.updateUser(id, updateData);
}

// Hapus User

export const deleteUser = async (id: string) => {
    // ini cara cek apakah usernya ada
    await getUserById(id)

    return await
        userRepository.deleteUser(id);
}