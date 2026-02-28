import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function elevateUser() {
    console.log('--- OSART Admin Escalation Tool ---');

    // Default mock user from the seed or a specific user email
    const targetEmail = process.argv[2] || 'admin@osart.cl';

    console.log(`Looking up user with email: ${targetEmail}`);

    // Find the user ID based on email
    // Note: We query the auth.users table indirectly or via profiles if available.
    // The safest way with service_role is admin.listUsers or querying the public.profiles

    const { data: profiles, error: profileErr } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('email', targetEmail) // Assuming email is on the profile, otherwise we need to rely on the auth module
        .limit(1);

    let userId = null;

    if (profiles && profiles.length > 0) {
        userId = profiles[0].id;
        console.log(`Found profile for ${targetEmail}: ID ${userId} (Current Role: ${profiles[0].role})`);
    } else {
        // If not found in profiles, try getting it from auth
        console.log(`Profile not found for ${targetEmail}. Attempting to list auth users...`);
        const { data: usersData, error: usersErr } = await supabase.auth.admin.listUsers();

        if (usersErr) {
            console.error('Failed to list auth users:', usersErr);
            process.exit(1);
        }

        const user = usersData?.users.find(u => u.email === targetEmail);
        if (user) {
            userId = user.id;
            console.log(`Found auth user for ${targetEmail}: ID ${userId}`);
        } else {
            console.error(`User with email ${targetEmail} not found in the system.`);
            console.log('Please register an account first in the app, then run: npx ts-node scripts/set_admin.ts <your_email>');
            process.exit(1);
        }
    }

    if (!userId) return;

    console.log(`Escalating user ${userId} to ADMIN role...`);

    // Update the profile role
    const { error: updateErr } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userId);

    if (updateErr) {
        console.error('Failed to update user profile role:', updateErr);
        process.exit(1);
    }

    // Try to update the raw_app_meta_data for the JWT claim just in case
    const { error: authUpdateErr } = await supabase.auth.admin.updateUserById(
        userId,
        { app_metadata: { role: 'admin' } }
    );

    if (authUpdateErr) {
        console.warn('Warning: Failed to update auth metadata (profile was updated though).', authUpdateErr);
    } else {
        console.log('Successfully updated auth metadata.');
    }

    console.log(`✅ Success! ${targetEmail} is now an ADMIN.`);
    console.log('You can now log into the OSART app and access the /admin dashboard.');
}

elevateUser();
