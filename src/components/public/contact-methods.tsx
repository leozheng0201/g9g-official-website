import { contactInfo, companyInfo } from '@/content/site'

const contactCards = [
  { label: '電話', value: contactInfo.phoneLabel, href: contactInfo.phoneHref },
  { label: 'Email', value: contactInfo.email, href: contactInfo.emailHref },
  { label: 'LINE', value: contactInfo.lineLabel, href: contactInfo.lineUrl, external: true },
] as const

export function ContactMethods() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {contactCards.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target={'external' in item && item.external ? '_blank' : undefined}
          rel={'external' in item && item.external ? 'noreferrer' : undefined}
          className="rounded-card border border-line bg-paper p-6 hover:border-ink"
        >
          <span className="text-sm font-bold text-gold">{item.label}</span>
          <strong className="mt-3 block break-words text-lg">{item.value}</strong>
          {'external' in item && item.external && <span className="sr-only">（另開新視窗）</span>}
        </a>
      ))}
      <div className="rounded-card border border-line bg-surface p-6 md:col-span-3">
        <strong className="block">{companyInfo.address}</strong>
        <span className="text-muted">{companyInfo.transit}</span>
      </div>
    </div>
  )
}
