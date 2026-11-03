import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  RegionProvider,
  useRegion,
  type RegionKey,
} from '../../../context/RegionContext'
import { supabase } from '../../../lib/supabase'
import AppUserMenu from '../../../components/app/AppUserMenu'
import { answerCompanion } from '../../../lib/companionAnswer'
import { seedDemoData } from '../../../lib/seedDemoData'
import '../../../styles/gift-dashboard.css'

// ASSESS BUTTON TO BE UPDATED ON MAIN HERO PAGE.
// Phase 2 Gift Dashboard UPRM Unified Inbox Core Loop

type DashRegionKey = RegionKey

type Channel = 'call' | 'whatsapp' | 'ig' | 'fb' | 'web' | 'sms' | 'email';
type Intent = 'Booking' | 'Question' | 'Complaint' | 'Payment' | 'Social Sale';
type Sentiment = 'positive' | 'neutral' | 'negative';
type Status = 'new' | 'open' | 'closed';

type Message = {
  id: string;
  from: 'user' | 'ai';
  text: string;
  time: string;
  memory?: string;
  accentNote?: string;
};

type Conversation = {
  id: string;
  name: string;
  avatar: string;
  channel: Channel;
  region: DashRegionKey;
  language: string;
  time: string;
  preview: string;
  intent: Intent;
  sentiment: Sentiment;
  confidence: number;
  status: Status;
  phone: string;
  business: string;
  payment: string;
  tags: string[];
  messages: Message[];
  bookings?: number;
  calls?: number;
  amount?: string;
};

const REGION_CONFIG = {
  africa: {
    label: 'Africa',
    flag: '🌍',
    badge: 'Africa OS',
    telephony: "Africa's Talking Primary + Twilio Fallback + Opus + USSD",
    payment: 'M-Pesa Flutterwave Paystack',
    compliance: 'NDPR',
    complianceLong: 'NDPR • SON • CBN Sandbox Lagos',
    voice: 'Lagos Yoruba',
    languages: ['EN','YO','Pidgin'],
    business: 'Eko Bites Lagos',
    numberPrefix: '+234',
    accent: 'Ibadan Yoruba 3s',
    city: 'Lagos',
    color: 'from-sky-500 to-blue-600',
  },
  eurozone: {
    label: 'Eurozone',
    flag: '🇪🇺',
    badge: 'Eurozone OS',
    telephony: 'Twilio/Vonage HD +44',
    payment: 'Stripe SEPA VAT OSS',
    compliance: 'GDPR AI Act',
    complianceLong: 'GDPR • ePrivacy • EU AI Act • Frankfurt',
    voice: 'Scouse London',
    languages: ['EN','FR','DE'],
    business: 'The Garden Restaurant London',
    numberPrefix: '+33',
    accent: 'Scouse Liverpool 94.2% accuracy',
    city: 'Paris',
    color: 'from-blue-500 to-indigo-600',
  },
  uk: {
    label: 'UK',
    flag: '🇬🇧',
    badge: 'UK OS',
    telephony: 'Twilio HD +44 Fallback',
    payment: 'Stripe UK VAT',
    compliance: 'UK GDPR',
    complianceLong: 'UK GDPR • PECR • FCA • London',
    voice: 'London RP',
    languages: ['EN','Scouse'],
    business: 'The Garden London UK',
    numberPrefix: '+44',
    accent: 'London Scouse 91% accuracy',
    city: 'London',
    color: 'from-slate-600 to-blue-600',
  },
} as const;

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    name: 'Aisha Bello',
    avatar: 'AB',
    channel: 'whatsapp',
    region: 'africa',
    language: 'YO',
    time: '2m ago',
    preview: 'Hi AiKOVA AI receptionist - I want to book appointment tomorrow for 2 people, do you have jollof?',
    intent: 'Booking',
    sentiment: 'positive',
    confidence: 96,
    status: 'new',
    phone: '+234 803 123 4567',
    business: 'Eko Bites Lagos',
    payment: 'M-Pesa',
    tags: ['New Customer','VIP'],
    bookings: 1, calls: 2, amount: '₦15,000 M-Pesa',
    messages: [
      { id:'m1', from:'user', time:'09:12', text:'Hi AiKOVA! I want to book appointment tomorrow for 2 people, do you have jollof?' },
      { id:'m2', from:'ai', time:'09:12', text:'Bawo ni Aisha! Yes we have party jollof ready 🔥 Slot tomorrow 2pm or 6pm?', memory:'Remembered from Qdrant: Eko Bites Lagos open Mon-Sat 9-6 815 vectors', accentNote:'Detected Ibadan Yoruba 3s • Voice mirror: Lagos Yoruba' },
      { id:'m3', from:'user', time:'09:14', text:'2pm works. Also can I pay with M-Pesa?'},
    ]
  },
  {
    id:'c2',
    name:'Sophie Laurent',
    avatar:'SL',
    channel:'ig',
    region:'eurozone',
    language:'FR',
    time:'5m ago',
    preview:'Bonjour! Saw your Instagram comment — can you auto-DM menu and book for tonight?',
    intent:'Social Sale',
    sentiment:'positive',
    confidence:94,
    status:'new',
    phone:'+33 6 12 34 56 78',
    business:'The Garden Restaurant London',
    payment:'Stripe SEPA',
    tags:['Instagram','High Intent'],
    bookings:1, calls:0, amount:'€58 Stripe',
    messages:[
      { id:'m1', from:'user', time:'10:04', text:'Bonjour! Saw your IG comment → DM close? I need table tonight for Garden?' },
      { id:'m2', from:'ai', time:'10:04', text:'Salut Sophie! Oui — Table tonight 8pm available. Sending menu + Stripe link?', memory:'Remembered from Qdrant: The Garden Restaurant London open Mon-Sat 9am-10pm 815 vectors', accentNote:'Detected Scouse Liverpool 94.2% accuracy • Voice mirror: French accent' },
    ]
  },
  {
    id:'c3',
    name:'Chinedu Okoro',
    avatar:'CO',
    channel:'call',
    region:'africa',
    language:'EN',
    time:'12m ago',
    preview:'Call transcript: I tried USSD booking but failed, can AI help with Flutterwave?',
    intent:'Complaint',
    sentiment:'neutral',
    confidence:89,
    status:'open',
    phone:'+234 701 987 6543',
    business:'Eko Bites Lagos',
    payment:'Flutterwave',
    tags:['USSD Fail','Voice'],
    bookings:0,calls:3,amount:'₦0',
    messages:[
      { id:'m1', from:'user', time:'08:33', text:'[Call transcript 1m22s] I tried USSD *384*... but network failed.' },
      { id:'m2', from:'ai', time:'08:34', text:'Sorry about USSD! I can book via WhatsApp now and send Flutterwave link. Ok?', memory:'Qdrant: USSD fallback playbook + Africa\'s Talking log', accentNote:'Detected Enugu Igbo 4.2s' },
    ]
  },
  {
    id:'c4',
    name:'Oliver Smith',
    avatar:'OS',
    channel:'web',
    region:'uk',
    language:'EN',
    time:'18m ago',
    preview:'Web chat: Do you support SEPA Direct Debit for subscription restaurant plan?',
    intent:'Question',
    sentiment:'neutral',
    confidence:92,
    status:'open',
    phone:'+44 7700 900123',
    business:'The Garden London UK',
    payment:'Stripe UK',
    tags:['Web Chat','Billing'],
    bookings:0,calls:1,amount:'£79/mo',
    messages:[
      { id:'m1', from:'user', time:'11:10', text:'Web chat: Do you support SEPA Direct Debit for subscription?' },
      { id:'m2', from:'ai', time:'11:11', text:'Yes Oliver — Stripe SEPA + Bacs for UK. VAT invoice auto. Want link?', memory:'Qdrant: Billing playbook £25 £79 £199 vs €25 €79 €199 VAT incl' },
    ]
  },
  {
    id:'c5',
    name:'Fatima Yusuf',
    avatar:'FY',
    channel:'sms',
    region:'africa',
    language:'Pidgin',
    time:'24m ago',
    preview:'SMS: How far? I wan pay for 5 people birthday package, M-Pesa dey?',
    intent:'Payment',
    sentiment:'positive',
    confidence:95,
    status:'new',
    phone:'+234 809 555 1122',
    business:'Eko Bites Lagos',
    payment:'M-Pesa',
    tags:['Birthday','5 pax'],
    bookings:1,calls:1,amount:'₦75,000 M-Pesa',
    messages:[
      { id:'m1', from:'user', time:'09:50', text:'How far? I wan pay for 5 people birthday package, M-Pesa dey?' },
      { id:'m2', from:'ai', time:'09:51', text:'Yes o! M-Pesa dey — Sending payment link now. Party jollof included 😊', memory:'Qdrant: Birthday playbook 5+ pax upsell' },
    ]
  },
  {
    id:'c6',
    name:'Léa Moreau',
    avatar:'LM',
    channel:'fb',
    region:'eurozone',
    language:'FR',
    time:'33m ago',
    preview:'FB Comment → Auto-DM: Your brunch reel went viral! Can we book corporate 12?',
    intent:'Social Sale',
    sentiment:'positive',
    confidence:93,
    status:'new',
    phone:'+33 7 88 99 00 11',
    business:'The Garden Restaurant London',
    payment:'Stripe SEPA',
    tags:['FB Viral','Corporate'],
    bookings:1,calls:0,amount:'€420 Stripe',
    messages:[
      { id:'m1', from:'user', time:'10:22', text:'Your brunch reel went viral! Can we book corporate 12 tomorrow?' },
      { id:'m2', from:'ai', time:'10:23', text:'Merci Léa! Yes — 12 seats corporate brunch tomorrow 10am. SEPA invoice?', memory:'Qdrant: Social-to-Sale engine Comment → Auto-DM → Close' },
    ]
  },
  {
    id:'c7',
    name:'Tunde Adekunle',
    avatar:'TA',
    channel:'whatsapp',
    region:'africa',
    language:'EN',
    time:'41m ago',
    preview:'Need refund - Paystack double charged, but I love your AI receptionist!',
    intent:'Complaint',
    sentiment:'negative',
    confidence:87,
    status:'open',
    phone:'+234 806 222 3344',
    business:'Eko Bites Lagos',
    payment:'Paystack',
    tags:['Refund','Paystack'],
    bookings:0,calls:2,amount:'₦12,000',
    messages:[
      { id:'m1', from:'user', time:'07:15', text:'Need refund — Paystack double charged me yesterday.' },
      { id:'m2', from:'ai', time:'07:16', text:'Oh no — Checking Paystack logs now. Will reverse in 24h + ₦2k voucher?', memory:'Qdrant: Refund playbook + Paystack webhook' },
    ]
  },
  {
    id:'c8',
    name:'Emma Clarke',
    avatar:'EC',
    channel:'email',
    region:'uk',
    language:'EN',
    time:'1h ago',
    preview:'Email: Requesting GDPR data export and VAT invoice for last 3 bookings.',
    intent:'Question',
    sentiment:'neutral',
    confidence:91,
    status:'closed',
    phone:'emma@garden.london',
    business:'The Garden London UK',
    payment:'Stripe UK',
    tags:['GDPR','VAT'],
    bookings:3,calls:0,amount:'£237 Stripe',
    messages:[
      { id:'m1', from:'user', time:'Yesterday', text:'Email: Requesting GDPR data export + VAT invoice for last 3 bookings' },
      { id:'m2', from:'ai', time:'Yesterday', text:'Export ready — Frankurt EU data residency. VAT OSS included. Sending PDF.', memory:'Qdrant: Compliance GDPR ePrivacy EU AI Act' },
    ]
  },
];

const CHANNEL_ICON: Record<Channel,string> = {
  call:'📞', whatsapp:'💬', ig:'📸', fb:'👥', web:'🌐', sms:'✉️', email:'📧'
};

const MODULES = [
  { id:'dashboard', label:'/dashboard KPIs', icon:'📊', badge:null },
  { id:'onboarding', label:'/onboarding 8 steps completed', icon:'✅', badge:'DONE' },
  { id:'inbox', label:'/inbox UPRM Gift Dashboard CORE LOOP', icon:'🎁', badge:'24 new', active:true },
  { id:'calls', label:'/calls Calls log', icon:'📞', badge:'8' },
  { id:'calendar', label:'/calendar Calendar bookings', icon:'📅', badge:'6' },
  { id:'knowledge', label:'/knowledge Knowledge base Qdrant 815 vectors', icon:'🧠', badge:'815' },
  { id:'voices', label:'/voices Voice Mesh library', icon:'🎙️', badge:'12' },
  { id:'social', label:'/social Social-to-Sale Comment → DM → Close', icon:'🚀', badge:'18' },
  { id:'team', label:'/team Team Smart Handoff', icon:'👥', badge:'3' },
  { id:'analytics', label:'/analytics Funnel Languages revenue', icon:'📈', badge:null },
  { id:'integrations', label:'/integrations 15+ connectors', icon:'🔌', badge:'15+' },
  { id:'billing', label:'/billing Billing $25 $79 $199 vs €25 €79 €199 VAT', icon:'💳', badge:null },
  { id:'settings', label:'/settings Settings GDPR NDPR etc', icon:'⚙️', badge:null },
];

function GiftDashboardInner() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const { region: ctxRegion, setRegion: setCtxRegion } = useRegion()
  const paramRegion = params.get('region')
  const initialRegion: DashRegionKey =
    paramRegion === 'africa' || paramRegion === 'eurozone' || paramRegion === 'uk'
      ? paramRegion
      : ctxRegion

  const [region, setRegionState] = useState<DashRegionKey>(initialRegion)
  const [activeModule, setActiveModule] = useState('inbox')
  const [activeTab, setActiveTab] = useState<'All' | 'Calls' | 'Messages' | 'Social' | 'Bookings'>('All')
  const [channelFilter, setChannelFilter] = useState<Channel[]>([])
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all')
  const [langFilter, setLangFilter] = useState<string>('all')
  const [regionFilter, setRegionFilter] = useState<DashRegionKey | 'all'>('all')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string>('c1')
  const [replyText, setReplyText] = useState('')
  const [showCompanion, setShowCompanion] = useState(true)
  const [companionInput, setCompanionInput] = useState('')
  const [companionMessages, setCompanionMessages] = useState<{ from: 'user' | 'ai'; text: string }[]>([
    {
      from: 'ai',
      text: `Captain! Gift Dashboard UPRM core loop — Unified Platform Relationship Management — One inbox for Calls SMS WhatsApp IG FB Web Email shared memory Qdrant 815 vectors — ${REGION_CONFIG[initialRegion].telephony} + ${REGION_CONFIG[initialRegion].payment} instantly swap! Want me to summarize 24 new conversations?`,
    },
  ])
  const [mobileMenu, setMobileMenu] = useState(false)
  const [busy, setBusy] = useState(false)
  const [saveResult, setSaveResult] = useState<{ saved: number; remaining: number; error: string | null } | null>(null)
  const [welcomeName, setWelcomeName] = useState<string | null>(params.get('welcome') === '1' ? 'there' : null)

  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS)
  const [dataSource, setDataSource] = useState<'live' | 'demo'>('demo')
  const [syncNote, setSyncNote] = useState<string | null>(null)
  const [businessName, setBusinessName] = useState<string | null>(null)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const cfg = REGION_CONFIG[region]

  const mapChannel = (ch?: string | null): Channel => {
    switch (ch) {
      case 'call':
        return 'call'
      case 'sms':
        return 'sms'
      case 'whatsapp':
        return 'whatsapp'
      case 'instagram_dm':
      case 'instagram_comment':
        return 'ig'
      case 'facebook_dm':
      case 'facebook_comment':
        return 'fb'
      case 'email':
        return 'email'
      case 'web_chat':
      default:
        return 'web'
    }
  }

  const mapIntent = (intent?: string | null): Intent => {
    const t = (intent || 'question').toLowerCase()
    if (t === 'booking') return 'Booking'
    if (t === 'complaint') return 'Complaint'
    if (t === 'payment') return 'Payment'
    if (t === 'social_sale' || t.includes('social')) return 'Social Sale'
    return 'Question'
  }

  useEffect(() => {
    if (params.get('welcome') !== '1') return
    if (!supabase) return
    let alive = true
    void supabase.auth.getUser().then(({ data }) => {
      if (!alive) return
      const u = data.user
      const n =
        (u?.user_metadata?.full_name as string | undefined) ||
        (u?.user_metadata?.name as string | undefined) ||
        u?.email?.split('@')[0] ||
        'there'
      setWelcomeName(n)
    })
    return () => {
      alive = false
    }
  }, [params])

  const setRegion = (next: DashRegionKey) => {
    setRegionState(next)
    setCtxRegion(next)
    const nextParams = new URLSearchParams(params)
    nextParams.set('region', next)
    setParams(nextParams, { replace: true })
  }

  async function reloadRecords() {
    if (!supabase) {
      setDataSource('demo')
      setSyncNote('Supabase not configured — showing demo inbox')
      return
    }
    try {
      const { data: auth } = await supabase.auth.getUser()
      const uid = auth.user?.id
      if (!uid) {
        setDataSource('demo')
        setSyncNote('Not signed in — demo inbox')
        return
      }
      const { data: biz, error: bErr } = await supabase
        .from('businesses')
        .select('id, name, region')
        .eq('user_id', uid)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()
      if (bErr) throw bErr
      if (!biz?.id) {
        setDataSource('demo')
        setSyncNote('No business yet — complete signup / settings')
        return
      }
      setBusinessName(biz.name)
      setBusinessId(biz.id)

      const { data: rows, error: cErr } = await supabase
        .from('conversations')
        .select('*')
        .eq('business_id', biz.id)
        .order('updated_at', { ascending: false })
        .limit(100)
      if (cErr) throw cErr

      if (!rows?.length) {
        setDataSource('demo')
        setSyncNote(`Synced · ${biz.name} · 0 live threads (demo until first call/SMS)`)
        return
      }

      const ids = rows.map((r) => r.id as string)
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .in('conversation_id', ids)
        .order('created_at', { ascending: true })

      const byConv = new Map<string, Message[]>()
      for (const m of msgs || []) {
        const cid = m.conversation_id as string
        const list = byConv.get(cid) || []
        list.push({
          id: m.id as string,
          from: m.from_role === 'ai' || m.from_role === 'human' ? 'ai' : 'user',
          text: (m.body as string) || '',
          time: new Date(m.created_at as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          memory: (m.memory_note as string) || undefined,
          accentNote: (m.accent_note as string) || undefined,
        })
        byConv.set(cid, list)
      }

      const mapped: Conversation[] = rows.map((r) => {
        const channel = mapChannel(r.contact_channel as string)
        const name = (r.contact_name as string) || 'Contact'
        const messages = byConv.get(r.id as string) || [
          {
            id: `${r.id}-p`,
            from: 'user' as const,
            text: (r.preview as string) || '—',
            time: new Date(r.updated_at as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]
        return {
          id: r.id as string,
          name,
          avatar: name.slice(0, 2).toUpperCase(),
          channel,
          region: ((r.region as DashRegionKey) || region),
          language: (r.language as string) || 'EN',
          time: new Date(r.updated_at as string).toLocaleString(),
          preview: (r.preview as string) || messages[messages.length - 1]?.text || '',
          intent: mapIntent(r.intent as string),
          sentiment: ((r.sentiment as Sentiment) || 'neutral'),
          confidence: Math.round(((r.ai_confidence as number) || 0.9) * 100),
          status: ((r.status as Status) || 'new'),
          phone: (r.contact_phone as string) || '',
          business: biz.name,
          payment: REGION_CONFIG[((r.region as DashRegionKey) || region)].payment,
          tags: (r.tags as string[]) || [],
          messages,
        }
      })

      setConversations(mapped)
      setSelectedId(mapped[0]?.id || '')
      setDataSource('live')
      setSyncNote(`Live · ${biz.name} · ${mapped.length} conversation${mapped.length === 1 ? '' : 's'}`)
    } catch (e) {
      console.warn('inbox sync failed', e)
      setDataSource('demo')
      setSyncNote(e instanceof Error ? e.message : 'Sync failed — demo inbox')
    }
  }

  useEffect(() => {
    void reloadRecords()
  }, [])

  // Realtime refresh when conversations change for this session
  useEffect(() => {
    const client = supabase
    if (!client) return
    const channel = client
      .channel('aikova-inbox')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => {
        void reloadRecords()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        void reloadRecords()
      })
      .subscribe()
    return () => {
      void client.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    setCompanionMessages((prev) => [
      ...prev.slice(0, 1),
      {
        from: 'ai',
        text: `Switched to ${cfg.flag} ${cfg.label} — Telephony ${cfg.telephony.split('+')[0]} • Payment ${cfg.payment} • Compliance ${cfg.complianceLong} • Voice ${cfg.voice} • Qdrant 815 vectors synced.`,
      },
    ])
  }, [region])

  const openModule = (id: string) => {
    setActiveModule(id)
    setMobileMenu(false)
    if (id === 'onboarding') {
      navigate(`/onboarding/entrance`)
      return
    }
    if (id === 'inbox') {
      navigate(`/app/inbox?region=${region}`)
      return
    }
    if (id === 'dashboard') {
      navigate(`/app/dashboard?region=${region}`)
      return
    }
    navigate(`/app/${id}?region=${region}`)
  }

  const filtered = useMemo(()=>{
    return conversations.filter(c=>{
      if(activeTab !== 'All'){
        if(activeTab==='Calls' && c.channel!=='call') return false;
        if(activeTab==='Messages' && !['whatsapp','sms','email','web'].includes(c.channel)) return false;
        if(activeTab==='Social' && !['ig','fb'].includes(c.channel)) return false;
        if(activeTab==='Bookings' && c.intent!=='Booking' && !c.bookings) return false;
      }
      if(channelFilter.length && !channelFilter.includes(c.channel)) return false;
      if(statusFilter!=='all' && c.status!==statusFilter) return false;
      if(langFilter!=='all' && c.language!==langFilter) return false;
      if(regionFilter!=='all' && c.region!==regionFilter) return false;
      if(search){
        const s = search.toLowerCase();
        return c.name.toLowerCase().includes(s) || c.preview.toLowerCase().includes(s) || c.phone.includes(s) || c.tags.join(' ').toLowerCase().includes(s);
      }
      return true;
    });
  }, [conversations, activeTab, channelFilter, statusFilter, langFilter, regionFilter, search]);

  const selected = useMemo(()=> conversations.find(c=>c.id===selectedId) || filtered[0] || conversations[0], [selectedId, filtered, conversations]);

  const counts = useMemo(()=>{
    return {
      all: conversations.length,
      calls: conversations.filter(c=>c.channel==='call').length,
      messages: conversations.filter(c=>['whatsapp','sms','email','web'].includes(c.channel)).length,
      social: conversations.filter(c=>['ig','fb'].includes(c.channel)).length,
      bookings: conversations.filter(c=>c.intent==='Booking' || c.bookings).length,
      new: conversations.filter(c=>c.status==='new').length,
    }
  }, [conversations]);

  function toggleChannel(ch: Channel){
    setChannelFilter(prev=> prev.includes(ch) ? prev.filter(x=>x!==ch) : [...prev, ch]);
  }

  function handleSendReply(){
    if(!replyText.trim() || !selected) return;
    const body = replyText.trim()
    const newMsg: Message = { id: Date.now().toString(), from:'ai', text: body, time:'now', memory:`Reply · ${cfg.business} · ${cfg.compliance}` };
    setConversations(prev=> prev.map(c=> c.id===selected.id ? { ...c, messages:[...c.messages, newMsg], preview: body.slice(0,80) } : c));
    setReplyText('');
    (async()=>{
      setBusy(true);
      let saved=0; let error: string | null = null;
      try{
        if (supabase && dataSource === 'live') {
          const { data: auth } = await supabase.auth.getUser()
          const uid = auth.user?.id
          if (!uid) throw new Error('Not signed in')
          const { data: biz } = await supabase.from('businesses').select('id').eq('user_id', uid).limit(1).maybeSingle()
          if (!biz?.id) throw new Error('No business')
          const { error: mErr } = await supabase.from('messages').insert({
            conversation_id: selected.id,
            business_id: biz.id,
            from_role: 'ai',
            body,
            memory_note: newMsg.memory,
          })
          if (mErr) throw mErr
          await supabase
            .from('conversations')
            .update({ preview: body.slice(0, 180), updated_at: new Date().toISOString(), status: 'open' })
            .eq('id', selected.id)
          saved = 1
        } else {
          saved = 1
        }
      }catch(e){ error = e instanceof Error ? e.message : String(e); }
      try{ await reloadRecords(); }catch(e){ error = error || (e instanceof Error ? e.message : String(e)); }
      setSaveResult({ saved, remaining: 1-saved, error });
      setBusy(false);
    })();
  }

  function handleQuickReply(text:string){
    setReplyText(text);
    inputRef.current?.focus();
  }

  function handleCompanionSend(){
    if(!companionInput.trim()) return;
    const userText = companionInput;
    setCompanionMessages(m=> [...m, {from:'user', text:userText}]);
    setCompanionInput('');
    const localFallback = (q: string) => {
      const responses: Record<string,string> = {
        'summarize': `Inbox: ${counts.new} new · ${counts.calls} calls · ${counts.messages} messages · ${conversations.length} threads (${dataSource}). ${syncNote || ''}`,
        'bookings': `Filter Bookings tab or open /app/calendar. Seed demo pack adds a sample booking.`,
        'payments': `Region ${region}: ${cfg.payment}. AKC wallet at /app/billing.`,
        'handoff': `Add team in /app/team — handoff-waterfall uses waterfall_order + emergency.`,
        'seed': `Use Seed demo on Settings or Sync bar to populate live rows.`,
      };
      const key = Object.keys(responses).find(k=> q.toLowerCase().includes(k)) || 'summarize';
      return responses[key] || responses['summarize'];
    };
    void answerCompanion(supabase, {
      businessId,
      query: userText,
      region,
      localFallback,
    }).then((r) => {
      setCompanionMessages((m) => [
        ...m,
        { from: 'ai', text: `${r.answer}${r.mode !== 'local' ? ` · [${r.mode}]` : ''}` },
      ])
    })
  }

  async function handleSeedDemo() {
    if (!supabase || !businessId) {
      setSyncNote('Sign in + business required to seed')
      return
    }
    setBusy(true)
    try {
      const r = await seedDemoData(supabase, businessId, region)
      setSyncNote(r.seeded ? `Seeded · ${JSON.stringify(r.counts)}` : r.reason || 'Skipped')
      await reloadRecords()
    } catch (e) {
      setSyncNote(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div data-safe-area-inset-root className="gift-shell min-h-screen bg-[#E6EBF4] text-[var(--text)] overflow-x-clip" style={{ boxSizing:'border-box', paddingTop:'var(--safe-area-inset-top)' }}>
      {welcomeName ? (
        <div className="border-b border-[#E2E8F0] bg-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[13px] font-semibold text-[#0F172A]">
            Welcome, <span style={{ background:'var(--grad)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{welcomeName}</span> — your UPRM Gift Dashboard is live.
          </p>
          <button
            type="button"
            className="text-[11px] font-bold text-[#64748B] hover:text-[#0F172A]"
            onClick={() => {
              setWelcomeName(null)
              const nextParams = new URLSearchParams(params)
              nextParams.delete('welcome')
              setParams(nextParams, { replace: true })
            }}
          >
            Dismiss
          </button>
        </div>
      ) : null}
      {/* Top Nav */}
      <header data-safe-area-sticky-top className="sticky z-40 bg-white/90 backdrop-blur-xl border-b border-[var(--border-soft)]" style={{ top:'var(--safe-area-inset-top)' }}>
        <div className="mx-auto max-w-[1920px] px-3 md:px-6 h-[64px] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={()=>setMobileMenu(v=>!v)} className="md:hidden w-9 h-9 rounded-xl bg-[#F1F5F9] grid place-items-center">☰</button>
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[12px] grid place-items-center text-[18px] font-black" style={{ background:'var(--grad)' }}>A</div>
              <div className="leading-[1.05]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[16px] tracking-tight">AiKOVA</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0F172A] text-white font-semibold tracking-wide">Ai Receptionist</span>
                </div>
                <div className="text-[10px] text-[#64748B] font-medium hidden sm:block">Built for Africa • Ready for Any Business • Now Building for Eurozone</div>
              </div>
            </Link>
          </div>

          {/* Center Flag Switch */}
          <div className="flex-1 flex justify-center">
            <div className="relative bg-[#F1F5F9] rounded-xl p-1 flex items-center gap-1 w-[320px] max-w-[88vw]">
              <div className="absolute h-[calc(100%-8px)] rounded-lg transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)] bg-[#0F172A]" style={{
                width: region==='africa' ? '32%' : region==='eurozone' ? '38%' : '26%',
                left: region==='africa' ? '4px' : region==='eurozone' ? '33%' : '68%',
              }} />
              {(['africa','eurozone','uk'] as RegionKey[]).map(k=>(
                <button key={k} onClick={()=>setRegion(k)} className={`relative z-10 flex-1 h-[32px] rounded-lg flex items-center justify-center gap-1.5 text-[12px] font-bold transition-colors ${region===k ? 'text-white' : 'text-[#64748B]'}`}>
                  <span>{REGION_CONFIG[k].flag}</span><span>{REGION_CONFIG[k].label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2 bg-[#F8FAFC] border border-[#F1F5F9] rounded-full px-3 h-8">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${cfg.color} animate-pulse`} />
              <span className="text-[11px] font-bold">{cfg.badge}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${dataSource === 'live' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {dataSource === 'live' ? 'LIVE' : 'DEMO'}
              </span>
            </div>
            <Link
              to={`/app/settings?region=${region}`}
              className="hidden sm:inline-flex h-8 px-3 rounded-full border border-[#E2E8F0] bg-white text-[11px] font-bold text-[#334155] items-center hover:bg-[#F8FAFC]"
            >
              Settings
            </Link>
            <AppUserMenu region={region} />
          </div>
        </div>

        {/* Progress sub-nav */}
        <div className="border-t border-[#F1F5F9] bg-white">
          <div className="mx-auto max-w-[1920px] px-3 md:px-6 h-9 flex items-center justify-between">
            <div className="flex items-center gap-3 text-[11px] min-w-0">
              <span className="px-2.5 py-1 rounded-full bg-[#0F172A] text-white font-bold shrink-0">Gift Dashboard UPRM</span>
              <span className="hidden md:inline truncate text-[#64748B]">
                {syncNote || (businessName ? businessName : 'Unified inbox')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-medium text-[#94A3B8] shrink-0">
              <button
                type="button"
                onClick={() => void reloadRecords()}
                className="px-2.5 py-1 rounded-full border border-[#E2E8F0] bg-white text-[#0F172A] font-bold hover:bg-[#F8FAFC]"
              >
                Sync
              </button>
              {dataSource === 'demo' && businessId ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void handleSeedDemo()}
                  className="px-2.5 py-1 rounded-full border border-[#E2E8F0] bg-white text-[#0F172A] font-bold hover:bg-[#F8FAFC] disabled:opacity-50"
                >
                  Seed live
                </button>
              ) : null}
              <Link to={`/app/dashboard?region=${region}`} className="hidden sm:inline font-bold text-[#0F172A] hover:underline">
                KPIs →
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Dynamic Adapter Bar */}
      <div className="sticky z-30 bg-white border-b border-[#F1F5F9] shadow-[0_2px_16px_rgba(15,23,42,.04)]" style={{ top:'calc(var(--safe-area-inset-top) + 64px + 36px)' }}>
        <div className="mx-auto max-w-[1920px] px-3 md:px-6 py-2.5 grid grid-cols-1 lg:grid-cols-4 gap-2">
          {[
            { label:'Telephony', value: cfg.telephony, icon:'📞' },
            { label:'Payment', value: cfg.payment, icon:'💳' },
            { label:'Compliance', value: cfg.complianceLong, icon:'🛡️' },
            { label:'Inbox', value:'Unified Omnichannel shared memory Qdrant 815 vectors + Voice Mesh local accent mirror', icon:'🧠' },
          ].map((item,i)=>(
            <div key={i} className="flex items-center gap-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2">
              <div className="w-7 h-7 rounded-lg bg-white border border-[#E2E8F0] grid place-items-center text-[13px]">{item.icon}</div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold tracking-widest text-[#94A3B8] uppercase">{item.label}</div>
                <div className="text-[11px] font-semibold text-[#0F172A] truncate">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1920px] flex min-h-[calc(100vh-140px)]">
        {/* Left Sidebar */}
        <aside className={`${mobileMenu ? 'flex' : 'hidden'} md:flex fixed md:sticky top-[112px] md:top-[130px] z-20 md:z-0 h-[calc(100vh-112px)] md:h-[calc(100vh-130px)] w-[86vw] md:w-[260px] shrink-0 flex-col bg-white border-r border-[#E2E8F0] overflow-hidden`}>
          <div className="p-3 border-b border-[#E2E8F0] flex items-center justify-between md:hidden">
            <span className="font-bold text-[13px]">App Modules</span>
            <button onClick={()=>setMobileMenu(false)} className="w-8 h-8 rounded-xl bg-[#F1F5F9]">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scroll p-2.5 space-y-1">
            <div className="text-[10px] font-bold tracking-[0.18em] text-[#94A3B8] uppercase px-2 py-1">Modules</div>
            {MODULES.map((m)=>(
              <button key={m.id} onClick={()=>openModule(m.id)} className={`w-full text-left rounded-xl border px-2.5 py-2 flex items-center gap-2.5 transition-all group ${activeModule===m.id ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-transparent border-transparent hover:bg-[#F8FAFC] hover:border-[#E2E8F0]'}`}>
                <span className={`w-7 h-7 rounded-lg grid place-items-center text-[13px] ${activeModule===m.id ? 'bg-white/10' : 'bg-[#F1F5F9]'}`}>{m.icon}</span>
                <span className={`flex-1 text-[11px] font-semibold leading-[1.2] truncate ${activeModule===m.id ? 'text-white' : 'text-[#334155]'}`}>{m.label.replace(/^\/\w+\s*/, '')}</span>
                {m.badge && <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${activeModule===m.id ? 'bg-white/15 text-white' : 'bg-[#F1F5F9] text-[#64748B]'}`}>{m.badge}</span>}
              </button>
            ))}
          </div>
        </aside>

        {/* Center Main */}
        <main className="flex-1 min-w-0 flex flex-col lg:flex-row">
          {/* Inbox List Pane */}
          <section className="flex-1 min-w-0 lg:max-w-[420px] border-r border-[#E2E8F0] bg-[#F1F5F9] flex flex-col">
            <div className="bg-white p-4 md:p-5 border-b border-[#E2E8F0]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[10px] font-bold tracking-wide text-[#64748B] uppercase">Gift Inbox</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[10px] font-bold text-[#1D4ED8] border border-[#BFDBFE]">
                      {cfg.flag} {cfg.label}
                    </span>
                  </div>
                  <h1 className="text-[22px] md:text-[26px] leading-[1.1] mt-2.5 tracking-[-0.02em] font-extrabold text-[#0F172A]">
                    Unified inbox
                  </h1>
                  <p className="text-[12px] text-[#64748B] mt-1 leading-5">
                    Calls · SMS · WhatsApp · Social · Web — shared memory
                  </p>
                </div>
                <button onClick={()=>setShowCompanion(v=>!v)} className="hidden lg:grid w-9 h-9 shrink-0 rounded-xl bg-[#0F172A] text-white place-items-center">💬</button>
              </div>

              {/* Tabs */}
              <div className="mt-4 flex items-center gap-1 overflow-x-auto custom-scroll pb-0.5">
                {[
                  { k:'All', count: counts.all },
                  { k:'Calls', count: counts.calls },
                  { k:'Messages', count: counts.messages },
                  { k:'Social', count: counts.social },
                  { k:'Bookings', count: counts.bookings },
                ].map((t)=>(
                  <button key={t.k} onClick={()=>setActiveTab(t.k as any)} className={`whitespace-nowrap rounded-lg px-3 h-8 text-[12px] font-bold border flex items-center gap-1.5 transition-all ${activeTab===t.k ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1]'}`}>
                    {t.k}<span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeTab===t.k ? 'bg-white/15 text-white' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}>{t.count}</span>
                  </button>
                ))}
              </div>

              {/* Filters */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-1 flex-wrap">
                  {(['whatsapp','ig','sms','call','web','fb','email'] as Channel[]).map(ch=>(
                    <button key={ch} onClick={()=>toggleChannel(ch)} className={`h-7 px-2 rounded-lg border text-[10px] font-semibold flex items-center gap-1 transition ${channelFilter.includes(ch) ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#94A3B8]'}`}>
                      <span>{CHANNEL_ICON[ch]}</span>{ch}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value as any)} className="h-8 rounded-lg bg-white border border-[#E2E8F0] px-2.5 text-[11px] font-semibold">
                    <option value="all">Status</option><option value="new">New</option><option value="open">Open</option><option value="closed">Closed</option>
                  </select>
                  <select value={langFilter} onChange={e=>setLangFilter(e.target.value)} className="h-8 rounded-lg bg-white border border-[#E2E8F0] px-2.5 text-[11px] font-semibold">
                    <option value="all">Lang</option>
                    {cfg.languages.map(l=><option key={l} value={l}>{l}</option>)}
                  </select>
                  <select value={regionFilter} onChange={e=>setRegionFilter(e.target.value as any)} className="h-8 rounded-lg bg-white border border-[#E2E8F0] px-2.5 text-[11px] font-semibold">
                    <option value="all">Region</option><option value="africa">Africa</option><option value="eurozone">Eurozone</option><option value="uk">UK</option>
                  </select>
                  <div className="flex-1 min-w-[140px] relative">
                    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" className="w-full h-8 rounded-lg bg-white border border-[#E2E8F0] pl-8 pr-3 text-[11px] font-medium outline-none focus:border-[#2962FF]" />
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px]">🔍</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scroll p-3 space-y-2 bg-[#F1F5F9]">
              {filtered.map((c)=>(
                <button key={c.id} onClick={()=>setSelectedId(c.id)} className={`gift-inbox-card w-full text-left rounded-xl border bg-white p-3.5 transition-all group ${selected?.id===c.id ? 'border-[#2962FF] shadow-md ring-1 ring-[#2962FF]/15' : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-sm'}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl grid place-items-center font-bold text-[12px] shrink-0 bg-[#0F172A] text-white">{c.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[13px] text-[#0F172A] truncate">{c.name}</span>
                        <span className="text-[12px] shrink-0 opacity-70">{CHANNEL_ICON[c.channel]}</span>
                        <span className="text-[10px] text-[#94A3B8] ml-auto shrink-0">{c.time}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                          {c.region === 'africa' ? 'Africa' : c.region === 'eurozone' ? 'Eurozone' : 'UK'}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold bg-[#F8FAFC] text-[#64748B]">{c.language}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${c.intent==='Booking' ? 'bg-[#0F172A] text-white' : c.intent==='Complaint' ? 'bg-[#FEF2F2] text-[#B91C1C]' : 'bg-[#F1F5F9] text-[#475569]'}`}>{c.intent}</span>
                      </div>
                      <div className="text-[12px] text-[#64748B] leading-[1.45] mt-1.5 line-clamp-2">{c.preview}</div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-[#94A3B8] truncate">{c.phone} · {c.payment}</span>
                        <span className="text-[10px] font-bold text-[#2962FF] shrink-0">{c.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              {filtered.length===0 && (
                <div className="rounded-xl bg-white border border-dashed border-[#CBD5E1] p-8 text-center">
                  <div className="text-[13px] font-semibold">No conversations match</div>
                  <div className="text-[11px] text-[#94A3B8] mt-1">Clear filters or try another search</div>
                </div>
              )}
            </div>
          </section>

          {/* Right Preview + Companion */}
          <section className="flex-1 min-w-0 flex flex-col bg-white">
            {selected && (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Header */}
                <div className="p-4 border-b border-[#F1F5F9] slide-panel">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-[#0F172A] text-white grid place-items-center font-bold">{selected.avatar}</div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[15px]">{selected.name}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F1F5F9] border">{CHANNEL_ICON[selected.channel]} {selected.channel} • {REGION_CONFIG[selected.region].flag} {REGION_CONFIG[selected.region].label}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0F172A] text-white font-bold">{selected.intent} • {selected.sentiment} 92%</span>
                        </div>
                        <div className="text-[11px] text-[#64748B] mt-1 flex items-center gap-2 flex-wrap">
                          <span>{selected.phone} • {selected.business} • 815 vectors memory</span>
                          <span className="px-2 py-0.5 rounded-md font-semibold border border-[#E2E8F0] bg-[#F8FAFC] text-[#475569]">Voice {REGION_CONFIG[selected.region].voice}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      <span className="text-[10px] px-2 py-1 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] font-semibold text-[#64748B]">{selected.tags.join(' · ')}</span>
                      <span className="text-[10px] px-2 py-1 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] font-bold text-[#1D4ED8]">{selected.payment}</span>
                    </div>
                  </div>
                </div>

                {/* Thread */}
                <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-3 bg-[#FCFDFF]">
                  {selected.messages.map(m=>(
                    <div key={m.id} className={`flex ${m.from==='user' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[78%] rounded-[20px] px-4 py-3 text-[13px] leading-[1.45] shadow-sm border ${m.from==='user' ? 'bg-white border-[#F1F5F9] text-[#0F172A] rounded-bl-[8px]' : 'bg-[#0F172A] text-white border-[#0F172A] rounded-br-[8px]'}`}>
                        <div>{m.text}</div>
                        {m.memory && (
                          <div className={`mt-2 text-[10px] px-2.5 py-1.5 rounded-full border inline-flex items-center gap-1.5 ${m.from==='user' ? 'bg-[#F8FAFC] border-[#E2E8F0] text-[#475569]' : 'bg-white/10 border-white/10 text-white/80'}`}>
                            <span>🧠</span>{m.memory}
                          </div>
                        )}
                        {m.accentNote && <div className="mt-1.5 text-[10px] opacity-70">🎙️ {m.accentNote}</div>}
                        <div className={`mt-1.5 text-[10px] ${m.from==='user' ? 'text-[#94A3B8]' : 'text-white/50'}`}>{m.time}</div>
                      </div>
                    </div>
                  ))}

                  <div className="rounded-2xl bg-white border border-[#F1F5F9] p-3 flex items-center gap-3">
                    <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Timeline</div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold">
                      <span className="px-2 py-1 rounded-full bg-[#F8FAFC] border">Calls {selected.calls || 0}</span>
                      <span className="px-2 py-1 rounded-full bg-[#F8FAFC] border">Messages {selected.messages.length}</span>
                      <span className="px-2 py-1 rounded-full bg-[#F8FAFC] border">Booking {selected.bookings || 0}</span>
                      <span className="px-2 py-1 rounded-full bg-[#0F172A] text-white">Payment {selected.amount}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Replies */}
                <div className="p-3 border-t border-[#F1F5F9] bg-white space-y-3">
                  <div className="flex gap-1.5 overflow-x-auto custom-scroll">
                    {[
                      region==='africa' ? 'We have slot tomorrow 2pm with party jollof 🍛' : 'We have slot tonight 8pm with tasting menu ✨',
                      region==='africa' ? 'Sending M-Pesa link now — ₦15k' : 'Sending Stripe SEPA link — €58 incl VAT',
                      'Eko Bites open Mon-Sat 9-6 815 vectors' ,
                      'Add to knowledge base Qdrant',
                    ].map(q=>(
                      <button key={q} onClick={()=>handleQuickReply(q)} className="whitespace-nowrap text-[11px] font-semibold px-3 h-8 rounded-full bg-[#F8FAFC] border border-[#F1F5F9] hover:border-[#0F172A] transition">{q}</button>
                    ))}
                  </div>

                  <div className="flex items-end gap-2">
                    <div className="flex-1 relative">
                      <input ref={inputRef} value={replyText} onChange={e=>setReplyText(e.target.value)} onKeyDown={e=> e.key==='Enter' && handleSendReply()} placeholder={`Type reply... AI assist • ${cfg.compliance} • ${cfg.voice}`} className="w-full min-h-[44px] rounded-[16px] bg-[#F8FAFC] border border-[#E2E8F0] px-4 pr-[88px] py-3 text-[13px] font-medium outline-none focus:border-[#2962FF] focus:ring-2 focus:ring-[#2962FF]/10" />
                      <div className="absolute right-1.5 top-1.5 flex gap-1">
                        <button className="w-8 h-8 rounded-xl bg-white border border-[#E2E8F0] grid place-items-center text-[12px]">🎤</button>
                        <button className="w-8 h-8 rounded-xl bg-white border border-[#E2E8F0] grid place-items-center text-[12px]">📎</button>
                      </div>
                    </div>
                    <button onClick={handleSendReply} disabled={busy || !replyText.trim()} className="h-[44px] px-5 rounded-xl gradient-btn text-[13px] disabled:opacity-50">Send</button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="h-8 px-3 rounded-full bg-white border border-[#E2E8F0] text-[11px] font-semibold">Book calendar</button>
                    <button className="h-8 px-3 rounded-full bg-white border border-[#E2E8F0] text-[11px] font-semibold">Send payment link {cfg.flag} {cfg.payment.split(' ')[0]}</button>
                    <button className="h-8 px-3 rounded-full bg-[#0F172A] text-white text-[11px] font-bold">Handoff to human</button>
                    <button className="h-8 px-3 rounded-full bg-[#F8FAFC] border text-[11px] font-semibold ml-auto">Add to KB</button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* AI Companion Bot */}
      <div className={`fixed z-40 bottom-[88px] right-3 md:right-6 w-[92vw] md:w-[360px] rounded-[24px] bg-white border border-[#E2E8F0] shadow-[0_16px_48px_rgba(15,23,42,.18)] overflow-hidden transition-all duration-300 ${showCompanion ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
        <div className="h-12 px-4 flex items-center justify-between bg-[#0F172A] text-white">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#2962FF] grid place-items-center text-[14px]">🤖</div>
            <span className="text-[12px] font-bold">AiKOVA Companion • With Memory • Gift Dashboard • Dual-Mode</span>
          </div>
          <button onClick={()=>setShowCompanion(false)} className="w-7 h-7 rounded-full bg-white/10 grid place-items-center">✕</button>
        </div>

        <div className="p-3 bg-[#F8FAFC] border-b border-[#F1F5F9] space-y-2">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#94A3B8]">Region Memory Bar • Instant Swap</div>
          <div className="flex flex-wrap gap-1.5">
            {[
              `Region ${cfg.flag} ${cfg.label}`,
              `Business ${cfg.business}`,
              `Inbox ${counts.new} new ${counts.calls} calls ${counts.messages} messages`,
              `Telephony ${cfg.telephony.split(' ')[0]}`,
              `Payment ${cfg.payment.split(' ')[0]}`,
              `Compliance ${cfg.compliance}`,
              `Voice ${cfg.voice}`,
              `Languages ${cfg.languages.join(' ')}`,
              `Qdrant 815 vectors`,
            ].map(p=>(
              <span key={p} className="text-[9px] font-bold px-2 py-1 rounded-full bg-white border border-[#E2E8F0] text-[#334155]">{p}</span>
            ))}
          </div>
        </div>

        <div className="h-[220px] overflow-y-auto custom-scroll p-3 space-y-2 bg-white">
          {companionMessages.map((m,i)=>(
            <div key={i} className={`flex ${m.from==='user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-[12px] leading-[1.4] border ${m.from==='user' ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-[#F8FAFC] border-[#F1F5F9] text-[#334155]'}`}>{m.text}</div>
            </div>
          ))}
        </div>

        <div className="p-2 bg-white border-t border-[#F1F5F9] space-y-2">
          <div className="flex gap-1 overflow-x-auto custom-scroll">
            {['Summarize 24 new','Show bookings today','Show payments M-Pesa vs Stripe','Handoff queue'].map(chip=>(
              <button key={chip} onClick={()=>{ setCompanionInput(chip); setTimeout(handleCompanionSend, 50); }} className="whitespace-nowrap text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#F1F5F9] border border-[#F1F5F9] hover:border-[#0F172A]/20">{chip}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={companionInput} onChange={e=>setCompanionInput(e.target.value)} onKeyDown={e=> e.key==='Enter' && handleCompanionSend()} placeholder="Ask companion..." className="flex-1 h-9 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] px-3 text-[12px] outline-none focus:border-[#2962FF]" />
            <button onClick={handleCompanionSend} className="w-9 h-9 rounded-full gradient-btn grid place-items-center">➤</button>
          </div>
        </div>
      </div>

      {!showCompanion && (
        <button onClick={()=>setShowCompanion(true)} className="fixed z-40 bottom-[88px] right-6 w-14 h-14 rounded-full bg-[#0F172A] text-white shadow-[0_8px_24px_rgba(0,0,0,.25)] grid place-items-center border-2 border-white">
          <span className="text-[20px]">🤖</span>
        </button>
      )}

      {/* Bottom sticky */}
      <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-xl border-t border-[#E2E8F0] shadow-[0_-8px_24px_rgba(15,23,42,.06)]">
        <div className="mx-auto max-w-[1920px] px-3 md:px-6 h-[52px] flex items-center justify-between gap-3 overflow-x-auto custom-scroll">
          <div className="flex items-center gap-2 text-[11px] font-semibold whitespace-nowrap">
            <span className="px-2.5 py-1 rounded-lg bg-[#0F172A] text-white">Gift Inbox</span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-[#64748B]">{cfg.flag} {cfg.label}</span>
            <span className="px-2 py-1 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] text-[#475569]">{counts.new} new · {counts.calls} calls · {counts.messages} messages</span>
            {saveResult && <span className={`px-2 py-1 rounded-lg border text-[10px] ${saveResult.error ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8]'}`}>Saved {saveResult.saved} · Remaining {saveResult.remaining}{saveResult.error ? ` · ${saveResult.error.slice(0,80)}` : ''}</span>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="h-8 px-4 rounded-xl bg-white border border-[#E2E8F0] text-[11px] font-bold">Save & Exit</button>
            <button className="h-8 px-4 rounded-xl gradient-btn text-[11px]">Deploy Gift Dashboard →</button>
          </div>
        </div>
      </div>

      {/* Production Tree Footer */}
      <footer className="bg-[#0F172A] text-white">
        <div className="mx-auto max-w-[1920px] px-6 py-8 grid md:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#2962FF] grid place-items-center font-black text-[#0F172A]">A</div><span className="font-bold">AiKOVA Production Tree</span></div>
            <div className="mt-3 text-[11px] leading-[1.5] text-white/60">One engine two continents · VisaguideOS · Gift Dashboard UPRM</div>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold">Best UI on planet Meta • Sharpness 100% • Torch Constancy</div>
          </div>
          {[
            { title:'A Marketing 22 Pages DONE', items:['Africa 11 pages','Eurozone 11 pages','Dual-mode flag switch','Gradient as content'] },
            { title:'B App Dashboard Phase 1 DONE', items:['Onboarding 8 steps dual-mode','Website?region= param','Africa/Eurozone instant swap','Qdrant 815 vectors'] },
            { title:'Phase 2 Gift Dashboard NOW', items:['UPRM Unified Inbox','Calls SMS WhatsApp IG FB Web Email','Shared memory Qdrant','Africa\'s Talking vs Twilio'] },
            { title:'Terminal Wiring Next', items:['app/(marketing)/eu/','app/(marketing)/africa/','app/(onboarding)/website?region=','app/(dashboard)/inbox?region='] },
          ].map(col=>(
            <div key={col.title}>
              <div className="text-[11px] font-bold tracking-widest uppercase text-white/40">{col.title}</div>
              <div className="mt-3 space-y-1.5 text-[11px] text-white/70">{col.items.map(it=><div key={it} className="flex gap-2"><span className="text-[#00E5FF]">›</span>{it}</div>)}</div>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 px-6 h-10 flex items-center justify-between text-[10px] text-white/40">
          <span>© AiKOVA • Ai Receptionist • Built for Africa Ready for Any Business Now Building for Eurozone • UPRM Unified Platform Relationship Management</span>
          <span className="hidden md:inline">Plug-and-Play 10-min • NDPR vs GDPR AI Act • M-Pesa vs Stripe SEPA</span>
        </div>
      </footer>
    </div>
  )
}

export default function GiftDashboardPage() {
  const [params] = useSearchParams()
  const paramRegion = params.get('region')
  const initialRegion =
    paramRegion === 'africa' || paramRegion === 'eurozone' || paramRegion === 'uk'
      ? paramRegion
      : undefined

  return (
    <RegionProvider initialRegion={initialRegion}>
      <GiftDashboardInner />
    </RegionProvider>
  )
}
