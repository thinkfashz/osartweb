import { Injectable } from '@nestjs/common';
import { makeSupabaseService } from '../../config/supabase.client';

@Injectable()
export class PaymentsService {
    private supabase = makeSupabaseService();

    async createPayment(orderId: string, provider: string, amount: number, externalId?: string) {
        const { data, error } = await this.supabase
            .from('payments')
            .insert({
                order_id: orderId,
                provider,
                amount,
                external_id: externalId,
                status: 'pending'
            })
            .select('*')
            .single();

        if (error) throw error;
        return data;
    }

    async updatePaymentStatus(paymentId: string, status: 'success' | 'failed') {
        const { data, error } = await this.supabase
            .from('payments')
            .update({ status })
            .eq('id', paymentId)
            .select('*')
            .single();

        if (error) throw error;
        return data;
    }
}
