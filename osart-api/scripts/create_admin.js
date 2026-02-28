require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://bplifywjbhtwzcplxksg.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwbGlmeXdqYmh0d3pjcGx4a3NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NzI0MDIsImV4cCI6MjA4NTE0ODQwMn0.iY7VkufS9XCE9Zwc71HGpnyArxo5mRZ13FQLxH45H5c';

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function main() {
    const email = 'admin@osart.cl';
    const password = 'Password123!';

    console.log('Creating admin user...');
    const { data: user, error } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: { full_name: 'Admin OSART' },
        app_metadata: { role: 'admin' }
    });

    if (error) {
        if (error.message.includes('already registered')) {
            console.log('User already exists. Updating password and role...');
            // Find user
            const { data: usersData } = await supabase.auth.admin.listUsers();
            const existingUser = usersData.users.find(u => u.email === email);
            if (existingUser) {
                await supabase.auth.admin.updateUserById(existingUser.id, {
                    password: password,
                    app_metadata: { role: 'admin' },
                    user_metadata: { full_name: 'Admin OSART' }
                });
                // Also ensure profile exists and has role admin
                await supabase.from('profiles').upsert({ id: existingUser.id, email: email, full_name: 'Admin OSART', role: 'admin' });
                console.log('SUCCESS: Admin user updated.');
                return;
            }
        }
        console.error('Error creating user:', error);
        return;
    }

    if (user && user.user) {
        // Upsert profile
        await supabase.from('profiles').upsert({ id: user.user.id, email: email, full_name: 'Admin OSART', role: 'admin' });
        console.log('SUCCESS: Admin user created.');
    }
}

main();
