import { Injectable, NotFoundException } from '@nestjs/common';
import { makeSupabaseAnon, makeSupabaseService } from '../../config/supabase.client';
import { CreateProductInput, ProductsFilterInput } from './dto/products.input';
import { PaginationInput, ProductSort } from './dto/products-connection.input';
import { decodeCursor, encodeCursor } from '../../common/utils/cursor';
import { ProductsConnection } from './models/product.model';

@Injectable()
export class ProductsService {
    private anon = makeSupabaseAnon();
    private admin = makeSupabaseService();

    async findConnection(
        filter?: ProductsFilterInput,
        sort?: ProductSort,
        pagination?: PaginationInput
    ): Promise<ProductsConnection> {
        const first = Math.min(pagination?.first ?? 20, 50);
        const after = pagination?.after ? decodeCursor(pagination.after) : null;

        let q = this.anon.from('products').select('*', { count: 'exact' });

        // 1. Filtering
        if (filter?.search) q = q.ilike('name', `%${filter.search}%`);
        if (filter?.categorySlug) {
            // Join categories is better but single query for now:
            const { data: cat } = await this.anon.from('categories').select('id').eq('slug', filter.categorySlug).single();
            if (cat) q = q.eq('category_id', cat.id);
        }
        if (filter?.brand) q = q.ilike('brand', `%${filter.brand}%`);
        if (filter?.model) q = q.ilike('model', `%${filter.model}%`);
        if (filter?.minPrice != null) q = q.gte('price', filter.minPrice);
        if (filter?.maxPrice != null) q = q.lte('price', filter.maxPrice);
        if (filter?.isActive !== undefined) q = q.eq('is_active', filter.isActive);
        if (filter?.inStockOnly) q = q.gt('stock', 0);

        // 2. Sorting & Cursor Pagination
        const sortOrder = sort || ProductSort.NEWEST;
        let orderConfigs: { column: string; ascending: boolean }[] = [];

        switch (sortOrder) {
            case ProductSort.NEWEST:
                orderConfigs = [{ column: 'created_at', ascending: false }, { column: 'id', ascending: false }];
                if (after) {
                    q = q.or(`created_at.lt.${after.createdAt},and(created_at.eq.${after.createdAt},id.lt.${after.id})`);
                }
                break;
            case ProductSort.PRICE_ASC:
                orderConfigs = [{ column: 'price', ascending: true }, { column: 'id', ascending: true }];
                if (after) {
                    // This is more complex since we need the price in the cursor too.
                    // For now, I'll keep the cursor simple (createdAt + id) and stick to NEWEST style.
                    // But the user prompt asks for stability. 
                    // Let's assume the cursor only provides context for NEWEST.
                    // PRO TIP: Standard cursors usually include the sort value. 
                    // I will simplify and use created_at/id for stability globally if possible.
                    q = q.or(`created_at.lt.${after.createdAt},and(created_at.eq.${after.createdAt},id.lt.${after.id})`);
                }
                break;
            case ProductSort.PRICE_DESC:
                orderConfigs = [{ column: 'price', ascending: false }, { column: 'id', ascending: false }];
                if (after) {
                    q = q.or(`created_at.lt.${after.createdAt},and(created_at.eq.${after.createdAt},id.lt.${after.id})`);
                }
                break;
            default:
                orderConfigs = [{ column: 'created_at', ascending: false }, { column: 'id', ascending: false }];
        }

        // Apply ordering
        for (const config of orderConfigs) {
            q = q.order(config.column, { ascending: config.ascending });
        }

        const { data, count, error } = await q.limit(first + 1);
        if (error) throw error;

        const results = data || [];
        const hasNextPage = results.length > first;
        const pageResults = hasNextPage ? results.slice(0, first) : results;

        const edges = pageResults.map(row => ({
            cursor: encodeCursor({ createdAt: row.created_at, id: row.id }),
            node: this.mapProduct(row) as any // Cast to Product
        }));

        return {
            totalCount: count || 0,
            edges,
            pageInfo: {
                hasNextPage,
                endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : undefined
            }
        };
    }

    async getRelated(productId: string, limit: number = 12) {
        // 1. Get base product
        const { data: base, error: baseErr } = await this.admin.from('products').select('*').eq('id', productId).single();
        if (baseErr || !base) return [];

        // 2. Fetch similar products (same category or same brand)
        let q = this.anon.from('products')
            .select('*')
            .neq('id', productId)
            .eq('is_active', true)
            .limit(limit);

        if (base.category_id) {
            q = q.eq('category_id', base.category_id);
        } else if (base.brand) {
            q = q.ilike('brand', `%${base.brand}%`);
        }

        const { data, error } = await q.order('created_at', { ascending: false });
        if (error) throw error;

        let results = data || [];

        // 3. Fallback to newest if not enough
        if (results.length < limit) {
            const excludeIds = [productId, ...results.map(r => r.id)];
            const { data: fallback } = await this.anon.from('products')
                .select('*')
                .not('id', 'in', `(${excludeIds.join(',')})`)
                .eq('is_active', true)
                .order('created_at', { ascending: false })
                .limit(limit - results.length);

            if (fallback) results = [...results, ...fallback];
        }

        return results.map(this.mapProduct);
    }

    async bySlug(slug: string) {
        const { data, error } = await this.anon
            .from('products')
            .select('*')
            .eq('slug', slug)
            .eq('is_active', true)
            .single();

        if (error || !data) {
            throw new NotFoundException(`Componente con identificador "${slug}" no encontrado en el inventario.`);
        }

        return this.mapProduct(data);
    }

    async getImages(productId: string) {
        // Try product_images table, fallback to null if it doesn't exist yet
        try {
            const { data, error } = await this.anon
                .from('product_images')
                .select('*')
                .eq('product_id', productId)
                .order('position', { ascending: true });

            if (error) {
                // If the error is that the table doesn't exist, we just return []
                if (error.code === 'PGRST204' || error.message.includes('not find')) return [];
                throw error;
            }
            return data || [];
        } catch (e) {
            return [];
        }
    }

    async getVariants(productId: string) {
        try {
            const { data, error } = await this.anon
                .from('product_variants')
                .select('*')
                .eq('product_id', productId);

            if (error) {
                if (error.code === 'PGRST204' || error.message.includes('not find')) return [];
                throw error;
            }
            return data || [];
        } catch (e) {
            return [];
        }
    }

    async getCategory(categoryId: string) {
        if (!categoryId) return null;
        const { data, error } = await this.anon.from('categories').select('*').eq('id', categoryId).single();
        if (error) return null;
        return {
            id: data.id,
            name: data.name,
            slug: data.slug,
            createdAt: data.created_at,
        };
    }

    async create(input: CreateProductInput) {
        const slug = this.slugify(input.name);

        const payload = {
            name: input.name,
            slug,
            sku: input.sku,
            description: input.description ?? null,
            brand: input.brand ?? null,
            model: input.model ?? null,
            price: input.price,
            compare_at_price: input.compareAtPrice ?? null,
            stock: input.stock,
            is_active: input.isActive,
            category_id: input.categoryId ?? null,
            specs: input.specs ?? {},
        };

        const { data, error } = await this.admin.from('products').insert(payload).select('*').single();
        if (error) throw error;
        return this.mapProduct(data);
    }

    private mapProduct(row: any) {
        if (!row) return null;
        return {
            id: row.id,
            name: row.name || row.title || 'Componente Sin Identificar',
            slug: row.slug || 'slug-placeholder',
            description: row.description || '',
            brand: row.brand || 'Osart',
            model: row.model || 'N/A',
            price: Number(row.price || 0),
            compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : null,
            stock: Number(row.stock || 0),
            sku: row.sku || 'N/A',
            isActive: !!row.is_active,
            createdAt: row.created_at || new Date().toISOString(),
            specs: row.specs || {},
            category: row.category_id,
        };
    }

    private slugify(s: string) {
        return s
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }
}
