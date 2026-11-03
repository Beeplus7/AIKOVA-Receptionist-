import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { SETUP } from '../../../lib/setupFlow'
import { WELCOME_AKC, formatAkc } from '../../../lib/akc/catalog'

const GRADIENT = 'linear-gradient(90deg, #00E5FF 0%, #2962FF 52%, #76FF03 100%)'

export default function OnboardingCompletePage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const region = params.get('region') || 'eurozone'
  const [name, setName] = useState<string>('there')
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    if (!supabase) return
    const client = supabase
    void client.auth.getUser().then(async ({ data }) => {
      const u = data.user
      if (!u) return
      const metaName =
        (u.user_metadata?.full_name as string | undefined) ||
        (u.user_metadata?.name as string | undefined) ||
        u.email?.split('@')[0] ||
        'there'
      setName(metaName)
      setEmail(u.email || '')
      try {
        localStorage.setItem(
          'aikova_onboarding',
          JSON.stringify({ completed: true, region, at: new Date().toISOString() }),
        )
      } catch {
        /* ignore */
      }
      const { error } = await client.rpc('mark_onboarding_complete', { p_region: region })
      if (error) {
        await client
          .from('businesses')
          .update({
            onboarding_status: 'complete',
            onboarding_step: 8,
            region,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', u.id)
      }
    })
  }, [region])

  return (
    <div className="min-h-screen grid place-items-center bg-[#E6EBF4] px-4 py-10">
      <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
        <div className="flex items-center gap-2.5">
          <div
            className="grid h-10 w-10 place-items-center rounded-2xl text-[15px] font-black text-[#0F172A]"
            style={{ background: GRADIENT }}
          >
            A
          </div>
          <div>
            <div className="text-[12px] font-bold uppercase tracking-widest text-slate-500">Setup complete</div>
            <div className="text-[15px] font-bold">Onboarding confirmed</div>
          </div>
        </div>

        <h1 className="mt-6 text-[32px] font-[800] tracking-tight leading-[1.05] text-[#0F172A]">
          Welcome,{' '}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GRADIENT }}>
            {name}
          </span>
        </h1>
        <p className="mt-3 text-[14px] leading-6 text-slate-600">
          Your AiKOVA receptionist is ready for{' '}
          <strong className="capitalize text-slate-900">{region}</strong>
          {email ? (
            <>
              {' '}
              · signed in as <span className="font-medium text-slate-800">{email}</span>
            </>
          ) : null}
          . You earned a {formatAkc(WELCOME_AKC)} trial credit when you join the wallet.
        </p>

        <ol className="mt-6 space-y-2 text-[12px] text-slate-600">
          {[
            'Marketing → Sign up',
            'Entrance · region door',
            'Onboarding 8 steps',
            'Confirmation (you are here)',
            'UPRM Gift Dashboard inbox',
          ].map((step, i) => (
            <li key={step} className="flex items-center gap-2">
              <span
                className="h-5 w-5 rounded-full text-white text-[10px] font-bold grid place-items-center"
                style={{ background: i < 4 ? GRADIENT : '#0F172A' }}
              >
                {i < 4 ? '✓' : '5'}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={() => navigate(`${SETUP.inbox}?region=${encodeURIComponent(region)}&welcome=1`)}
          className="mt-8 w-full h-12 rounded-full text-[14px] font-bold text-[#0F172A] shadow-lg"
          style={{ background: GRADIENT }}
        >
          Open Gift Dashboard — Welcome {name.split(' ')[0]} →
        </button>

        <div className="mt-4 flex justify-between text-[11px] font-semibold text-slate-500">
          <Link to={`${SETUP.onboarding}?region=${region}`} className="hover:text-slate-800">
            ← Back to onboarding
          </Link>
          <Link to="/app/dashboard" className="hover:text-slate-800">
            KPIs →
          </Link>
        </div>
      </div>
    </div>
  )
}
