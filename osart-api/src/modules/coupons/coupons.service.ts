import { Injectable, NotFoundException } from '@nestjs/common';
import { makeSupabaseService } from '../../config/supabase.client';

@Injectable()
export class CouponsService {
    private supabase = makeSupabaseService();

    async findByCode(code: string) {
        const { data, error } = await this.supabase
            .from('coupons')
            .select('*')
            .eq('code', code)
            .eq('active', true)
            .maybeSingle();

        if (error) throw error;
        if (!data) throw new NotFoundException('Coupon not found or inactive');

        return data;
    }

    async validateCoupon(code: string, total: number) {
        const coupon = await this.findByCode(code);

        const now = new Date();
        if (coupon.start_date && new Date(coupon.start_date) > now) {
            throw new Error('Coupon not yet active');
        }
        if (coupon.end_date && new Date(coupon.end_date) < now) {
            throw new Error('Coupon has expired');
        }
        if (total < Number(coupon.min_total)) {
            throw new Error(`Minimum purchase of ${coupon.min_total} required to use this coupon`);
        }

        return coupon;
    }
}
