import ProductWizard from '@/components/admin/products/ProductWizard';

export default function NewProductPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-zinc-950 tracking-tighter">ADD NEW UNIT</h1>
                <p className="text-zinc-500 font-medium italic">Enrolling fresh hardware into the OSART ecosystem.</p>
            </div>

            <ProductWizard />
        </div>
    );
}
