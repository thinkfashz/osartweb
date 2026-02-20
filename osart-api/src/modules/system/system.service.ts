import { Injectable } from '@nestjs/common';
import { makeSupabaseService } from '../../config/supabase.client';
import { DatabaseStatus, TableStatus } from './models/database-status.model';

@Injectable()
export class SystemService {
    private admin = makeSupabaseService();

    async getDatabaseStatus(): Promise<DatabaseStatus> {
        const tablesToTrack = ['products', 'categories', 'orders', 'order_items', 'profiles', 'wishlist_items', 'coupons', 'stock_movements'];
        const tableStatuses: TableStatus[] = [];

        for (const tableName of tablesToTrack) {
            const { count, error } = await this.admin
                .from(tableName)
                .select('*', { count: 'exact', head: true });

            if (error) {
                console.error(`Error querying table ${tableName}:`, error.message);
            }

            tableStatuses.push({
                name: tableName,
                rowCount: error ? 0 : (count || 0),
                lastUpdate: new Date().toISOString(), // In a real app, query last audit log
            });
        }

        return {
            connected: true,
            databaseUrl: 'Supabase OSART Core',
            tables: tableStatuses,
            version: 2,
        };
    }
}
