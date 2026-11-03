import type { RegionKey } from '../../context/RegionContext'

export type TryLang =
  | 'en'
  | 'fr'
  | 'de'
  | 'es'
  | 'pt'
  | 'nl'
  | 'yo'
  | 'pcm'
  | 'ha'
  | 'ig'
  | 'sw'
  | 'zu'
  | 'af'

export type TryLangMeta = {
  id: TryLang
  label: string
  short: string
  /** BCP-47 for Web Speech API */
  speech: string
  regions: RegionKey[]
  group: 'europe' | 'africa'
}

export const TRY_LANGS: TryLangMeta[] = [
  { id: 'en', label: 'English', short: 'EN', speech: 'en-GB', regions: ['africa', 'eurozone', 'uk'], group: 'europe' },
  { id: 'fr', label: 'Français', short: 'FR', speech: 'fr-FR', regions: ['eurozone', 'africa', 'uk'], group: 'europe' },
  { id: 'de', label: 'Deutsch', short: 'DE', speech: 'de-DE', regions: ['eurozone', 'uk'], group: 'europe' },
  { id: 'es', label: 'Español', short: 'ES', speech: 'es-ES', regions: ['eurozone', 'uk'], group: 'europe' },
  { id: 'pt', label: 'Português', short: 'PT', speech: 'pt-PT', regions: ['eurozone', 'africa'], group: 'europe' },
  { id: 'nl', label: 'Nederlands', short: 'NL', speech: 'nl-NL', regions: ['eurozone'], group: 'europe' },
  // African languages
  { id: 'yo', label: 'Yorùbá', short: 'YO', speech: 'en-NG', regions: ['africa'], group: 'africa' },
  { id: 'pcm', label: 'Naija Pidgin', short: 'PCM', speech: 'en-NG', regions: ['africa'], group: 'africa' },
  { id: 'ha', label: 'Hausa', short: 'HA', speech: 'en-NG', regions: ['africa'], group: 'africa' },
  { id: 'ig', label: 'Igbo', short: 'IG', speech: 'en-NG', regions: ['africa'], group: 'africa' },
  { id: 'sw', label: 'Kiswahili', short: 'SW', speech: 'sw-KE', regions: ['africa'], group: 'africa' },
  { id: 'zu', label: 'isiZulu', short: 'ZU', speech: 'en-ZA', regions: ['africa'], group: 'africa' },
  { id: 'af', label: 'Afrikaans', short: 'AF', speech: 'af-ZA', regions: ['africa'], group: 'africa' },
]

export function defaultLangForRegion(_region: RegionKey): TryLang {
  return 'en'
}

export function langsForRegion(region: RegionKey): TryLangMeta[] {
  const list = TRY_LANGS.filter((l) => l.regions.includes(region))
  if (region === 'africa') {
    // Africa-first ordering: local langs then shared EN/FR/PT
    return [...list].sort((a, b) => {
      if (a.group !== b.group) return a.group === 'africa' ? -1 : 1
      return a.label.localeCompare(b.label)
    })
  }
  return list
}

export type BizProfile = {
  id: string
  name: string
  short: string
  phone: string
  agent: string
  accent: string
  payment: string
}

export function bizForRegion(region: RegionKey): BizProfile {
  if (region === 'africa') {
    return {
      id: 'eko_bites_lagos_demo',
      name: 'Eko Bites · Lagos',
      short: 'Eko Bites',
      phone: '+234 801 234 5678',
      agent: 'Aisha',
      accent: 'Lagos · multi-language',
      payment: 'Paystack',
    }
  }
  if (region === 'uk') {
    return {
      id: 'garden_london_demo',
      name: 'The Garden · London',
      short: 'The Garden',
      phone: '+44 7700 900123',
      agent: 'Riley',
      accent: 'London RP',
      payment: 'Stripe UK',
    }
  }
  return {
    id: 'garden_paris_demo',
    name: 'Garden Restaurant · Paris',
    short: 'Garden',
    phone: '+33 1 23 45 67 89',
    agent: 'Camille',
    accent: 'Paris FR',
    payment: 'Stripe SEPA',
  }
}

type Msg = { from: 'ai' | 'user'; text: string }

/** Chat demo lines — short, natural turns */
export function chatScript(region: RegionKey, lang: TryLang): Msg[] {
  const b = bizForRegion(region)
  const pack: Record<TryLang, Msg[]> = {
    en: [
      { from: 'ai', text: `Hi — ${b.short}. ${b.agent} here via AiKOVA. Table for how many, and what time?` },
      { from: 'user', text: '4 people, 7pm tonight please' },
      { from: 'ai', text: `Perfect. Table for 4 at 7. Want a ${b.payment} deposit, or pay on arrival?` },
      { from: 'user', text: `Send ${b.payment} link` },
      { from: 'ai', text: `Sent. See you at 7 — this is a demo until you go live.` },
    ],
    fr: [
      { from: 'ai', text: `Bonsoir — ${b.short}. ${b.agent} (AiKOVA). Réservation pour combien ?` },
      { from: 'user', text: 'Quatre personnes, ce soir à 19h' },
      { from: 'ai', text: `Parfait. Table 4 à 19h. Acompte ${b.payment}, ou sur place ?` },
      { from: 'user', text: 'Oui, envoyez le lien' },
      { from: 'ai', text: `C’est parti. À ce soir — démo sans compte.` },
    ],
    de: [
      { from: 'ai', text: `Guten Abend — ${b.short}. ${b.agent} von AiKOVA. Tisch für wie viele?` },
      { from: 'user', text: 'Vier Personen, heute 19 Uhr' },
      { from: 'ai', text: `Alles klar. 4 Gäste um 19 Uhr. ${b.payment}-Link oder vor Ort?` },
      { from: 'user', text: 'Ja bitte den Link' },
      { from: 'ai', text: `Unterwegs. Bis heute Abend — Demo ohne Anmeldung.` },
    ],
    es: [
      { from: 'ai', text: `Buenas — ${b.short}. Soy ${b.agent}. ¿Mesa para cuántos y a qué hora?` },
      { from: 'user', text: '4 personas, a las 19:00' },
      { from: 'ai', text: `Hecho. Mesa 4 a las 19. ¿Depósito ${b.payment} o al llegar?` },
      { from: 'user', text: 'Envía el enlace' },
      { from: 'ai', text: `Enviado. Nos vemos a las 19 — demo sin registro.` },
    ],
    pt: [
      { from: 'ai', text: `Olá — ${b.short}. ${b.agent} da AiKOVA. Mesa para quantas pessoas?` },
      { from: 'user', text: '4 pessoas, às 19h' },
      { from: 'ai', text: `Confirmado. Mesa 4 às 19. Link ${b.payment} ou pagar aí?` },
      { from: 'user', text: 'Envia o link' },
      { from: 'ai', text: `Enviado. Até às 19 — demo sem registo.` },
    ],
    nl: [
      { from: 'ai', text: `Goedenavond — ${b.short}. ${b.agent} via AiKOVA. Tafel voor hoeveel?` },
      { from: 'user', text: 'Vier personen, vanavond om 19:00' },
      { from: 'ai', text: `Top. 4 gasten om 19:00. ${b.payment}-link of ter plaatse?` },
      { from: 'user', text: 'Stuur de link' },
      { from: 'ai', text: `Verstuurd. Tot vanavond — demo zonder account.` },
    ],
    yo: [
      { from: 'ai', text: `Ẹ káalẹ́ — ${b.short}. ${b.agent} ni. Àwọn mélòó, nígbà wo?` },
      { from: 'user', text: 'Ènìyàn mẹ́rin, ní agogo méje' },
      { from: 'ai', text: `Ó dára. Tábìlì 4 ní 7. ${b.payment} ni, tàbí owó níbi?` },
      { from: 'user', text: 'Fi ọ̀nà ${b.payment} ránṣẹ́' },
      { from: 'ai', text: `Mo ti fi ránṣẹ́. A ó pàdé ní 7.` },
    ],
    pcm: [
      { from: 'ai', text: `How far — ${b.short}. ${b.agent} here. How many people, wetin time?` },
      { from: 'user', text: '4 people for 7pm tonight' },
      { from: 'ai', text: `E sharp. Table for 4 by 7. ${b.payment} link or you go pay for ground?` },
      { from: 'user', text: 'Abeg send the link' },
      { from: 'ai', text: `Link don go. See you for 7 — demo, no signup.` },
    ],
    ha: [
      { from: 'ai', text: `Sannu — ${b.short}. Ni ${b.agent}. Mutane nawa, da wane lokaci?` },
      { from: 'user', text: 'Mutane hudu, karfe bakwai yau' },
      { from: 'ai', text: `To. Tebur 4 da karfe 7. Link ${b.payment} ko biya a wurin?` },
      { from: 'user', text: 'Aika link din' },
      { from: 'ai', text: `Na aika. Sai da karfe 7 — demo ne kawai.` },
    ],
    ig: [
      { from: 'ai', text: `Ndewo — ${b.short}. Aha m bụ ${b.agent}. Ndị ole, oge ole?` },
      { from: 'user', text: 'Madụ anọ, elekere asaa' },
      { from: 'ai', text: `Ọ dị mma. Tebụl 4 n’elekere 7. Link ${b.payment} ka ịkwụ ụgwọ ebe ahụ?` },
      { from: 'user', text: 'Ziga link ahụ' },
      { from: 'ai', text: `E zigara. Anyị ga-ahụ n’elekere 7.` },
    ],
    sw: [
      { from: 'ai', text: `Habari — ${b.short}. Mimi ni ${b.agent}. Meza kwa watu wangapi, saa ngapi?` },
      { from: 'user', text: 'Watu wanne, saa moja usiku' },
      { from: 'ai', text: `Sawa. Meza 4 saa 19:00. Link ya ${b.payment} au lipa pale?` },
      { from: 'user', text: 'Tuma link tafadhali' },
      { from: 'ai', text: `Nimetuma. Tuonane saa saba — demo tu.` },
    ],
    zu: [
      { from: 'ai', text: `Sawubona — ${b.short}. Ngingu-${b.agent}. Abantu abangaki, nini?` },
      { from: 'user', text: 'Abantu abane, ngehora lesikhombisa' },
      { from: 'ai', text: `Kuhle. Itafula labantu abane ngo-7. I-link ye-${b.payment} noma ukhokhe lapho?` },
      { from: 'user', text: 'Thumela i-link' },
      { from: 'ai', text: `Ngithumile. Sizobonana ngo-7 — yi-demo.` },
    ],
    af: [
      { from: 'ai', text: `Goeienaand — ${b.short}. ${b.agent} hier. Tafel vir hoeveel, watter tyd?` },
      { from: 'user', text: 'Vier mense, sewe-uur vanaand' },
      { from: 'ai', text: `Lekker. Tafel vir 4 om 19:00. ${b.payment}-skakel of betaal daar?` },
      { from: 'user', text: 'Stuur die skakel' },
      { from: 'ai', text: `Gestuur. Sien jou om sewe — net ’n demo.` },
    ],
  }
  return pack[lang] || pack.en
}

export type CallLines = {
  /** Shown in the call UI */
  display: string
  /** Spoken — latinized / TTS-friendly where needed */
  speak: string
}

/**
 * Phone-call style lines: short sentences so chunked TTS sounds human.
 * African langs get a speak-friendly form (browser TTS rarely has YO/HA/IG voices).
 */
export function callSpeech(region: RegionKey, lang: TryLang): CallLines {
  const b = bizForRegion(region)
  const pack: Record<TryLang, CallLines> = {
    en: {
      display: `Am I speaking with you? This is ${b.agent}, calling from ${b.short}. I’m ringing about the table you just booked online. That’s a table for four, at seven this evening. Does that all look right? Wonderful — your ${b.payment} link is on the way. See you at seven. Take care.`,
      speak: `Am I speaking with you? This is ${b.agent}, calling from ${b.short}. I’m ringing about the table you just booked online. That’s a table for four, at seven this evening. Does that all look right? Wonderful — your ${b.payment} link is on the way. See you at seven. Take care.`,
    },
    fr: {
      display: `Allô, c’est bien vous ? Ici ${b.agent}, de ${b.short}. Je vous appelle pour la table que vous venez de réserver. Table pour quatre, à dix-neuf heures. C’est bien ça ? Parfait — je vous envoie le lien ${b.payment}. À tout à l’heure. Au revoir.`,
      speak: `Allô, c’est bien vous ? Ici ${b.agent}, de ${b.short}. Je vous appelle pour la table que vous venez de réserver. Table pour quatre, à dix-neuf heures. C’est bien ça ? Parfait — je vous envoie le lien ${b.payment}. À tout à l’heure. Au revoir.`,
    },
    de: {
      display: `Hallo, spreche ich mit Ihnen? Hier ist ${b.agent} von ${b.short}. Ich rufe wegen Ihres Tisches an, den Sie gerade gebucht haben. Vier Personen, heute um neunzehn Uhr. Passt das so? Super — Ihr ${b.payment}-Link kommt gleich. Bis heute Abend. Tschüss.`,
      speak: `Hallo, spreche ich mit Ihnen? Hier ist ${b.agent} von ${b.short}. Ich rufe wegen Ihres Tisches an, den Sie gerade gebucht haben. Vier Personen, heute um neunzehn Uhr. Passt das so? Super — Ihr ${b.payment}-Link kommt gleich. Bis heute Abend. Tschüss.`,
    },
    es: {
      display: `¿Hablo con usted? Soy ${b.agent}, de ${b.short}. Le llamo por la mesa que acaba de reservar. Mesa para cuatro, a las siete de la tarde. ¿Es correcto? Perfecto — le envío el enlace ${b.payment}. Nos vemos a las siete. Cuídese.`,
      speak: `¿Hablo con usted? Soy ${b.agent}, de ${b.short}. Le llamo por la mesa que acaba de reservar. Mesa para cuatro, a las siete de la tarde. ¿Es correcto? Perfecto — le envío el enlace ${b.payment}. Nos vemos a las siete. Cuídese.`,
    },
    pt: {
      display: `Estou a falar consigo? Aqui é ${b.agent}, de ${b.short}. Ligo sobre a mesa que acabou de reservar. Mesa para quatro, às dezanove horas. Está certo? Ótimo — envio o link ${b.payment}. Até às sete. Cuide-se.`,
      speak: `Estou a falar consigo? Aqui é ${b.agent}, de ${b.short}. Ligo sobre a mesa que acabou de reservar. Mesa para quatro, às dezanove horas. Está certo? Ótimo — envio o link ${b.payment}. Até às sete. Cuide-se.`,
    },
    nl: {
      display: `Spreek ik met u? Dit is ${b.agent} van ${b.short}. Ik bel over de tafel die u net heeft geboekt. Vier personen, vanavond om zeven uur. Klopt dat? Mooi — uw ${b.payment}-link komt eraan. Tot vanavond. Doei.`,
      speak: `Spreek ik met u? Dit is ${b.agent} van ${b.short}. Ik bel over de tafel die u net heeft geboekt. Vier personen, vanavond om zeven uur. Klopt dat? Mooi — uw ${b.payment}-link komt eraan. Tot vanavond. Doei.`,
    },
    yo: {
      display: `Ṣé èmi ni mo ń bá ọ sọ̀rọ̀? ${b.agent} ni láti ${b.short}. Mo ń pè ẹ nípa tábìlì tí o ṣẹ̀ṣẹ̀ forúkọsílẹ̀. Tábìlì fún ènìyàn mẹ́rin, ní agogo méje. Ṣé ó tọ́? Ó dára — ọ̀nà ${b.payment} ń bọ̀. A ó pàdé ní 7. Ó dàbọ̀.`,
      speak: `She eh-mee nee mo n bah oh soh-roh? ${b.agent} nee lah-tee ${b.short}. Mo n peh eh nee-pah tah-bee-lee tee oh sheh-sheh fo-roo-koh-see-leh. Tah-bee-lee foon eh-nee-yan meh-reen, nee ah-goh-goh meh-jeh. Sheh oh toh? Oh dah-rah — oh-nah ${b.payment} n boh. Ah oh pah-deh nee meh-jeh. Oh dah-baw.`,
    },
    pcm: {
      display: `Abeg, na you I dey talk to? Na ${b.agent} from ${b.short}. I dey call about the table wey you just book. Table for four people, by seven tonight. E correct? Sharp — ${b.payment} link dey come. See you for seven. Take care.`,
      speak: `Abeg, na you I dey talk to? Na ${b.agent} from ${b.short}. I dey call about the table wey you just book. Table for four people, by seven tonight. E correct? Sharp — ${b.payment} link dey come. See you for seven. Take care.`,
    },
    ha: {
      display: `Shin ina magana da kai? Ni ${b.agent} daga ${b.short}. Ina kira game da tebur da ka yi booking. Tebur ga mutane hudu, karfe bakwai yau. Shin haka ne? To — link din ${b.payment} yana zuwa. Sai da karfe bakwai. Sai anjima.`,
      speak: `Shin ina magana da kai? Ni ${b.agent} daga ${b.short}. Ina kira game da tebur da ka yi booking. Tebur ga mutane hudu, karfe bakwai yau. Shin haka ne? Toh — link din ${b.payment} yana zuwa. Sai da karfe bakwai. Sai anjima.`,
    },
    ig: {
      display: `À na m agwa gị okwu? Aha m bụ ${b.agent} sitere na ${b.short}. A na m akpọ gị maka tebụl ị debanyere. Tebụl maka madụ anọ, n’elekere asaa. Ọ dị mma? Ọ dị mma — link ${b.payment} na-abịa. Anyị ga-ahụ n’elekere asaa. Ka ọ dị.`,
      speak: `Ah nah m ah-gwah gee oh-kwoo? Ah-hah m boo ${b.agent} see-teh-reh nah ${b.short}. Ah nah m ahk-poh gee mah-kah teh-bool ee deh-bahn-yeh-reh. Teh-bool mah-kah mah-doo ah-noh, neh-leh-keh-reh ah-sah. Oh dee mmah? Oh dee mmah — link ${b.payment} nah-ah-byah. Ah-nyee gah-ah-hoo neh-leh-keh-reh ah-sah. Kah oh dee.`,
    },
    sw: {
      display: `Habari, naongea na wewe? Mimi ni ${b.agent} kutoka ${b.short}. Ninakupigia kuhusu meza uliyohifadhi. Meza ya watu wanne, saa moja usiku. Sawa? Vizuri — link ya ${b.payment} inakuja. Tuonane saa saba. Kwaheri.`,
      speak: `Habari, naongea na wewe? Mimi ni ${b.agent} kutoka ${b.short}. Ninakupigia kuhusu meza uliyohifadhi. Meza ya watu wanne, saa moja usiku. Sawa? Vizuri — link ya ${b.payment} inakuja. Tuonane saa saba. Kwaheri.`,
    },
    zu: {
      display: `Sawubona, ngikhuluma nawe? Ngingu-${b.agent} wase-${b.short}. Ngikufonela ngethebula olibhukile. Itafula labantu abane, ngehora lesikhombisa. Kulungile? Kuhle — i-link ye-${b.payment} iyeza. Sizobonana ngo-7. Sala kahle.`,
      speak: `Sah-woo-boh-nah, ngee-koo-loo-mah nah-weh? Ngee-ngoo ${b.agent} wah-seh ${b.short}. Ngee-koo-foh-neh-lah ngeh-teh-boo-lah oh-lee-boo-kee-leh. Ee-tah-foo-lah lah-bahn-too ah-bah-neh, ngeh-hoh-rah leh-see-kohm-bee-sah. Koo-loo-ngee-leh? Koo-hleh — ee-link yeh ${b.payment} ee-yeh-zah. See-zoh-boh-nah-nah ngo seven. Sah-lah kah-hleh.`,
    },
    af: {
      display: `Hallo, praat ek met jou? Dis ${b.agent} van ${b.short}. Ek bel oor die tafel wat jy pas bespreek het. Tafel vir vier, sewe-uur vanaand. Is dit reg? Lekker — jou ${b.payment}-skakel is op pad. Sien jou om sewe. Totsiens.`,
      speak: `Hallo, praat ek met jou? Dis ${b.agent} van ${b.short}. Ek bel oor die tafel wat jy pas bespreek het. Tafel vir vier, sewe-uur vanaand. Is dit reg? Lekker — jou ${b.payment}-skakel is op pad. Sien jou om sewe. Totsiens.`,
    },
  }
  return pack[lang] || pack.en
}

export function speechLangFor(lang: TryLang, region: RegionKey): string {
  if (lang === 'en') {
    if (region === 'africa') return 'en-NG'
    if (region === 'uk') return 'en-GB'
    return 'en-GB'
  }
  if (lang === 'pcm' || lang === 'yo' || lang === 'ha' || lang === 'ig') return 'en-NG'
  if (lang === 'zu') return 'en-ZA'
  const meta = TRY_LANGS.find((l) => l.id === lang)
  return meta?.speech || 'en-GB'
}

export function scenariosFor(lang: TryLang): { id: string; label: string; prompt: string }[] {
  const map: Partial<Record<TryLang, { id: string; label: string; prompt: string }[]>> = {
    en: [
      { id: 'book', label: 'Book a table', prompt: 'I need a table for 2 tonight at 8' },
      { id: 'hours', label: 'Opening hours', prompt: 'What time do you close on Sunday?' },
      { id: 'pay', label: 'Payment', prompt: 'Can I pay with card?' },
    ],
    fr: [
      { id: 'book', label: 'Réserver', prompt: 'Table pour 2 ce soir à 20h' },
      { id: 'hours', label: 'Horaires', prompt: 'Vous fermez à quelle heure dimanche ?' },
      { id: 'pay', label: 'Paiement', prompt: 'Puis-je payer par carte ?' },
    ],
    yo: [
      { id: 'book', label: 'Ìforúkọsílẹ̀', prompt: 'Mo fẹ́ tábìlì fún ènìyàn méjì ní agogo mẹ́jọ' },
      { id: 'hours', label: 'Àkókò', prompt: 'Nígbà wo ni ẹ ti ilé ní ọjọ́ Àìkú?' },
      { id: 'pay', label: 'Owó', prompt: 'Ṣé mo lè san owó pẹ̀lú káàdì?' },
    ],
    pcm: [
      { id: 'book', label: 'Book table', prompt: 'I wan table for 2 people by 8 tonight' },
      { id: 'hours', label: 'Closing time', prompt: 'Una close what time for Sunday?' },
      { id: 'pay', label: 'Payment', prompt: 'I fit pay with card?' },
    ],
    ha: [
      { id: 'book', label: 'Booking', prompt: 'Ina son tebur ga mutane biyu da karfe takwas' },
      { id: 'hours', label: 'Lokaci', prompt: 'Yaushe kuke rufe ranar Lahadi?' },
      { id: 'pay', label: 'Biya', prompt: 'Zan iya biya da kati?' },
    ],
    ig: [
      { id: 'book', label: 'Debanye', prompt: 'Achọrọ m tebụl maka madụ abụọ n’elekere asatọ' },
      { id: 'hours', label: 'Oge', prompt: 'Olee mgbe unu na-emechi ụbọchị Sọnde?' },
      { id: 'pay', label: 'Ụgwọ', prompt: 'Enwere m ike ịkwụ ụgwọ na kaadị?' },
    ],
    sw: [
      { id: 'book', label: 'Weka meza', prompt: 'Nahitaji meza ya watu 2 saa 2 usiku' },
      { id: 'hours', label: 'Saa', prompt: 'Mnafunga saa ngapi Jumapili?' },
      { id: 'pay', label: 'Malipo', prompt: 'Naweza kulipa kwa kadi?' },
    ],
    zu: [
      { id: 'book', label: 'Bhuka', prompt: 'Ngifuna itafula labantu ababili ngo-8' },
      { id: 'hours', label: 'Izikhathi', prompt: 'Nivala nini ngeSonto?' },
      { id: 'pay', label: 'Inkokhelo', prompt: 'Ngingakhokha ngekhadi?' },
    ],
    af: [
      { id: 'book', label: 'Bespreek', prompt: 'Ek wil ’n tafel vir 2 om agtuur' },
      { id: 'hours', label: 'Ure', prompt: 'Wanneer maak julle toe op Sondag?' },
      { id: 'pay', label: 'Betaling', prompt: 'Kan ek met kaart betaal?' },
    ],
  }
  return map[lang] || map.en!
}
