import * as auditRepository from './audit.repository';

/**
 * Mengambil daftar audit log.
 * @param limit - Jumlah maksimum entri yang dikembalikan (opsional)
 */
export const getAuditLog = async (limit?: number) => {
    return await auditRepository.getAuditLog(limit);
};
