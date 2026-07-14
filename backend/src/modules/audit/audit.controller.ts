import { Request, Response } from 'express';
import * as auditService from './audit.service';

/**
 * GET /api/audit
 * Query params: ?limit=10
 */
export const getAuditLog = async (req: Request, res: Response): Promise<void> => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
        const data = await auditService.getAuditLog(limit);

        res.status(200).json({
            message: 'Audit log berhasil diambil',
            data,
        });
    } catch (error: any) {
        console.error('Error fetching audit log:', error);
        res.status(500).json({
            message: 'Gagal mengambil audit log',
            error: error.message,
        });
    }
};
