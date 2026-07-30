import { Container } from '@/components/public/container'

export function LegalDocument({
  effectiveDate,
  sections,
}: {
  effectiveDate: string
  sections: readonly (readonly [string, string])[]
}) {
  return (
    <Container className="py-16 sm:py-20">
      <p className="text-sm text-muted">{effectiveDate}</p>
      <nav aria-label="本頁目錄" className="mt-6 rounded-card border border-line bg-surface p-5">
        <h2 className="font-black">本頁目錄</h2>
        <ol className="mt-3 grid gap-2 sm:grid-cols-2">
          {sections.map(([title], index) => <li key={title}><a href={`#legal-${index + 1}`} className="hover:underline">{index + 1}. {title}</a></li>)}
        </ol>
      </nav>
      <div className="mt-12 grid gap-10">
        {sections.map(([title, content], index) => (
          <section id={`legal-${index + 1}`} key={title} className="scroll-mt-28 border-b border-line pb-8">
            <h2 className="text-2xl font-black">{index + 1}. {title}</h2>
            <p className="mt-4 max-w-4xl text-lg text-muted">{content}</p>
          </section>
        ))}
      </div>
    </Container>
  )
}
