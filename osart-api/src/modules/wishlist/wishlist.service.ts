import { Injectable, NotFoundException } from '@nestjs/common';
import { makeSupabaseService } from '../../config/supabase.client';

@Injectable()
export class WishlistService {
    private supabase = makeSupabaseService();

    async getWishlist(userId: string) {
        const { data, error } = await this.supabase
            .from('wishlists')
            .select('id, user_id, product_id, created_at, product:products(*)')
            .eq('user_id', userId);

        if (error) throw error;

        return (data ?? []).map(row => ({
            id: row.id,
            userId: row.user_id,
            productId: row.product_id,
            product: row.product,
            createdAt: row.created_at,
        }));
    }

    async toggleWishlist(userId: string, productId: string) {
        // Check if exists
        const { data: existing } = await this.supabase
            .from('wishlists')
            .select('id')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .maybeSingle();

        if (existing) {
            // Remove
            const { error } = await this.supabase
                .from('wishlists')
                .delete()
                .eq('id', existing.id);

            if (error) throw error;
        } else {
            // Add
            const { data: product } = await this.supabase
                .from('products')
                .select('id')
                .eq('id', productId)
                .maybeSingle();

            if (!product) throw new NotFoundException('Product not found');

            const { error } = await this.supabase
                .from('wishlists')
                .insert({ user_id: userId, product_id: productId });

            if (error) throw error;
        }

        return this.getWishlist(userId);
    }
}
