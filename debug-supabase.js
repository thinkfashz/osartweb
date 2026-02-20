const { createClient } = require('@supabase/supabase-js');

const url = 'https://bplifywjbhtwzcplxksg.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwbGlmeXdqYmh0d3pjcGx4a3NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NzI0MDIsImV4cCI6MjA4NTE0ODQwMn0.iY7VkufS9XCE9Zwc71HGpnyArxo5mRZ13FQLxH45H5c';

const supabase = createClient(url, key);

async function debug() {
    console.log('--- Testing products fetch ---');
    const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(name, slug)')
        .limit(1);

    if (error) {
        console.error('Fetch Error:', JSON.stringify(error, null, 2));
    } else {
        console.log('Fetch Success:', JSON.stringify(data, null, 2));
    }
}

debug();
