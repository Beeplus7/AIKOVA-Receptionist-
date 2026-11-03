import type { SupabaseClient } from '@supabase/supabase-js'
import type { RegionKey } from './supabase'

/** Insert sample inbox + Phase 3 rows for the signed-in business (RLS). Idempotent-ish: skips if conversations already exist. */
export async function seedDemoData(
  client: SupabaseClient,
  businessId: string,
  region: RegionKey = 'africa',
): Promise<{ seeded: boolean; reason?: string; counts?: Record<string, number> }> {
  const { count, error: cErr } = await client
    .from('conversations')
    .select('id', { count: 'exact', head: true })
    .eq('business_id', businessId)
  if (cErr) throw cErr
  if ((count || 0) > 0) {
    return { seeded: false, reason: 'Already has conversations — seed skipped' }
  }

  const isAfrica = region === 'africa'
  const phoneA = isAfrica ? '+2348012345678' : '+447700900123'
  const phoneB = isAfrica ? '+2348098765432' : '+33123456789'
  const now = Date.now()

  const { data: convs, error: convErr } = await client
    .from('conversations')
    .insert([
      {
        business_id: businessId,
        contact_name: isAfrica ? 'Aisha Bello' : 'Sophie Laurent',
        contact_phone: phoneA,
        contact_channel: 'whatsapp',
        region,
        language: isAfrica ? 'EN' : 'FR',
        intent: 'booking',
        sentiment: 'positive',
        ai_confidence: 0.94,
        status: 'new',
        preview: isAfrica ? 'Hi, can I book a table for 4 at 7pm?' : 'Bonsoir, table pour 2 ce soir?',
        tags: ['seed', 'booking'],
      },
      {
        business_id: businessId,
        contact_name: isAfrica ? 'Chinedu Okoro' : 'Oliver Hart',
        contact_phone: phoneB,
        contact_channel: 'call',
        region,
        language: 'EN',
        intent: 'complaint',
        sentiment: 'negative',
        ai_confidence: 0.88,
        status: 'open',
        preview: 'Missed call — needs callback about payment',
        tags: ['seed', 'callback'],
      },
      {
        business_id: businessId,
        contact_name: isAfrica ? 'Adaeze Nwosu' : 'Léa Moreau',
        contact_phone: isAfrica ? '+2347011223344' : '+491701234567',
        contact_channel: 'instagram_dm',
        region,
        language: isAfrica ? 'Pidgin' : 'DE',
        intent: 'social_sale',
        sentiment: 'positive',
        ai_confidence: 0.91,
        status: 'new',
        preview: 'How much for the weekend special?',
        tags: ['seed', 'social'],
      },
    ])
    .select('id, contact_name, preview')

  if (convErr) throw convErr
  const rows = convs || []

  const messages = rows.flatMap((c, i) => [
    {
      conversation_id: c.id,
      business_id: businessId,
      from_role: 'user' as const,
      body: c.preview || 'Hello',
      memory_note: 'seed',
    },
    {
      conversation_id: c.id,
      business_id: businessId,
      from_role: 'ai' as const,
      body:
        i === 0
          ? 'Happy to help — I have 7pm available. Shall I confirm?'
          : i === 1
            ? 'Sorry we missed you. I can schedule a callback or transfer to a human.'
            : 'The weekend special is listed in our knowledge base — want me to book?',
      memory_note: 'seed · demo reply',
    },
  ])

  const { error: mErr } = await client.from('messages').insert(messages)
  if (mErr) throw mErr

  const starts = new Date(now + 3 * 3600_000)
  const ends = new Date(now + 4 * 3600_000)

  const [{ error: callErr }, { error: bookErr }, { error: socialErr }, { error: teamErr }, { error: ksErr }, { error: intErr }, { error: anErr }] =
    await Promise.all([
      client.from('calls').insert({
        business_id: businessId,
        conversation_id: rows[1]?.id || null,
        phone_from: phoneB,
        region,
        provider: isAfrica ? 'africas_talking' : 'twilio',
        status: 'completed',
        duration_sec: 42,
        missed: true,
        saved_from_missed: true,
        sentiment: 'neutral',
        transcript: 'Caller asked for callback about payment.',
      }),
      client.from('bookings').insert({
        business_id: businessId,
        conversation_id: rows[0]?.id || null,
        contact_name: rows[0]?.contact_name || 'Guest',
        contact_phone: phoneA,
        starts_at: starts.toISOString(),
        ends_at: ends.toISOString(),
        timezone: isAfrica ? 'Africa/Lagos' : 'Europe/Paris',
        provider: 'internal',
        status: 'confirmed',
        notes: 'Seed booking from demo pack',
      }),
      client.from('social_conversions').insert({
        business_id: businessId,
        platform: 'instagram',
        trigger_type: 'comment',
        trigger_text: 'How much?',
        auto_dm_sent: true,
        auto_dm_at: new Date().toISOString(),
        booked: false,
        paid: false,
        status: 'open',
      }),
      client.from('team_members').insert([
        {
          business_id: businessId,
          name: 'Front desk',
          role: 'agent',
          skills: ['booking', 'general'],
          phone: phoneA,
          available: true,
          emergency: false,
          waterfall_order: 10,
        },
        {
          business_id: businessId,
          name: 'Owner on-call',
          role: 'owner',
          skills: ['escalation'],
          phone: phoneB,
          available: true,
          emergency: true,
          waterfall_order: 90,
        },
      ]),
      client.from('knowledge_sources').insert([
        {
          business_id: businessId,
          source_type: 'faq',
          title: 'Hours',
          content: isAfrica
            ? 'Open Mon–Sat 10:00–22:00 WAT. Closed Sundays.'
            : 'Open Tue–Sun 11:00–23:00 local. Closed Mondays.',
          token_count: 24,
        },
        {
          business_id: businessId,
          source_type: 'service',
          title: 'Weekend special',
          content: isAfrica
            ? 'Weekend special ₦12,000 for two including drink. Book via WhatsApp.'
            : 'Weekend special €45 for two including soft drink. Book online or call.',
          token_count: 28,
        },
      ]),
      client.from('integrations').upsert(
        [
          {
            business_id: businessId,
            provider: isAfrica ? 'africas_talking' : 'twilio',
            status: 'connected',
            region,
            config: { seed: true },
          },
          {
            business_id: businessId,
            provider: isAfrica ? 'm_pesa' : 'stripe',
            status: 'connected',
            region,
            config: { seed: true },
          },
        ],
        { onConflict: 'business_id,provider' },
      ),
      client.from('analytics_events').insert([
        {
          business_id: businessId,
          event_type: 'resolution',
          channel: 'whatsapp',
          region,
          language: 'EN',
          value: 1,
          meta: { seed: true },
        },
        {
          business_id: businessId,
          event_type: 'minutes',
          channel: 'call',
          region,
          value: 42,
          meta: { seed: true },
        },
        {
          business_id: businessId,
          event_type: 'seed.demo_pack',
          channel: 'app',
          region,
          value: 1,
          meta: { at: new Date().toISOString() },
        },
      ]),
    ])

  const errs = [callErr, bookErr, socialErr, teamErr, ksErr, intErr, anErr].filter(Boolean)
  if (errs.length) {
    throw new Error(errs.map((e) => e!.message).join('; '))
  }

  return {
    seeded: true,
    counts: {
      conversations: rows.length,
      messages: messages.length,
      calls: 1,
      bookings: 1,
      social: 1,
      team: 2,
      knowledge: 2,
    },
  }
}
