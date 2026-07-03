import * as categoryRepository from './categories.repository';

export const getAllCategories = async () => {
    return await categoryRepository.findAllCategories()
}