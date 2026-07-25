const crypto = require('crypto');
require('dotenv').config({ path: '../.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const events = [
    {
        name: 'Harshad Mehta Scam',
        category: 'Scam',
        country: 'India',
        start_date: '1992-04-23',
        end_date: '1992-05-30',
        description: 'Major stock market scam orchestrated by Harshad Mehta.',
        details: { severity: 'High' }
    },
    {
        name: 'Dot-com Bubble',
        category: 'Global',
        country: 'Global',
        start_date: '2000-03-10',
        end_date: '2001-10-09',
        description: 'Massive sell-off of technology stocks.',
        details: { severity: 'High' }
    },
    {
        name: 'Global Financial Crisis',
        category: 'Global',
        country: 'Global',
        start_date: '2008-09-15',
        end_date: '2009-03-09',
        description: 'Collapse of Lehman Brothers triggering a global recession.',
        details: { severity: 'Severe' }
    },
    {
        name: 'Economic Slowdown',
        category: 'Economic',
        country: 'India',
        start_date: '2013-05-22',
        end_date: '2013-08-28',
        description: 'Taper tantrum and Indian rupee depreciation.',
        details: { severity: 'Medium' }
    },
    {
        name: 'Demonetisation',
        category: 'Policy',
        country: 'India',
        start_date: '2016-11-08',
        end_date: '2016-12-30',
        description: 'Cancellation of legal tender of ₹500 and ₹1,000 notes.',
        details: { severity: 'Medium' }
    },
    {
        name: 'COVID-19 Crash',
        category: 'Pandemic',
        country: 'Global',
        start_date: '2020-02-20',
        end_date: '2020-03-23',
        description: 'Global market crash due to COVID-19 pandemic lockdowns.',
        details: { severity: 'Severe' }
    },
    {
        name: 'Russia-Ukraine War',
        category: 'Geopolitical',
        country: 'Global',
        start_date: '2022-02-24',
        end_date: '2022-06-17',
        description: 'Invasion of Ukraine causing global supply chain disruptions.',
        details: { severity: 'High' }
    }
];

async function seed() {
    console.log('Seeding events...');
    const { data: existingEvents } = await supabase.from('historical_events').select('name');
    const existingNames = existingEvents ? existingEvents.map(e => e.name) : [];
    
    for (const evt of events) {
        if (!existingNames.includes(evt.name)) {
            evt.id = crypto.randomUUID();
            const { error } = await supabase.from('historical_events').insert(evt);
            if (error) {
                console.error('Failed to insert', evt.name, error);
            } else {
                console.log('Inserted', evt.name);
            }
        } else {
            console.log('Skipped (already exists):', evt.name);
        }
    }
    console.log('Done.');
}

seed();
