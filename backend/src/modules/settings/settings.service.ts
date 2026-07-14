import * as settingsRepository from './settings.repository';

export const getSiteSetting = async () => {
    return await settingsRepository.getSiteSetting();
};

export const updateSiteSetting = async (data: { heroTitle?: string; heroSubtitle?: string }) => {
    return await settingsRepository.updateSiteSetting(data);
};
