import { Injectable, NotFoundException } from '@nestjs/common';
import { makeSupabaseAnon, makeSupabaseService } from '../../config/supabase.client';

@Injectable()
export class CategoriesService {
    private anon = makeSupabaseAnon();
    private admin = makeSupabaseService();

    async list() {
        const { data, error } = await this.anon.from('categories').select('*').order('name');
        if (error) throw error;
        return (data ?? []).map(this.mapCategory);
    }

    async bySlug(slug: string) {
        const { data, error } = await this.anon.from('categories').select('*').eq('slug', slug).single();
        if (error || !data) throw new NotFoundException('Category not found');
        return this.mapCategory(data);
    }

    async create(name: string) {
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const { data, error } = await this.admin.from('categories').insert({ name, slug }).select('*').single();
        if (error) throw error;
        return this.mapCategory(data);
    }

    private mapCategory(row: any) {
        return {
            id: row.id,
            name: row.name,
            slug: row.slug,
            createdAt: row.created_at,
        };
    }
}
