require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function elevate() {
    const email = 'f.eduardomicolta@gmail.com';
    const password = 'Password123!';

    console.log(`Elevating ${email}...`);

    const { data: usersData, error: listErr } = await supabase.auth.admin.listUsers();
    if (listErr) { console.error('List error:', listErr); return; }

    const user = usersData.users.find(u => u.email === email);
    if (!user) { console.log('User not found'); return; }

    const { data: updateData, error: updateErr } = await supabase.auth.admin.updateUserById(user.id, {
        password: password,
        app_metadata: { role: 'admin' },
        user_metadata: { full_name: 'Admin OSART' }
    });

    if (updateErr) {
        console.error('Update error:', updateErr);
        return;
    }

    const { error: profileErr } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', user.id);
    if (profileErr) {
        console.error('Profile update error:', profileErr);
    }

    console.log('SUCCESS! User elevated. Password updated.');
}
elevate();
