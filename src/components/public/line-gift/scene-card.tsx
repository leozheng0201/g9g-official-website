import { SourceLabel } from '@/components/public/line-gift/source-label'

export function SceneCard({ title, interpretation }: { title: string; interpretation: string }) {
  return (
    <article className="rounded-card border border-line bg-paper p-6">
      <SourceLabel kind="official" />
      <h3 className="mt-4 text-xl font-black">{title}</h3>
      <div className="mt-5 border-t border-line pt-5">
        <SourceLabel kind="interpretation" />
        <p className="mt-3 text-muted">{interpretation}</p>
      </div>
    </article>
  )
}
