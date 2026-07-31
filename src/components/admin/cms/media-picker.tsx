'use client'

export type MediaPickerAsset = { id: string; originalFilename: string; altText?: string | null }

export function MediaPicker({ assets, value, onChange }: { assets: MediaPickerAsset[]; value?: string; onChange: (id: string) => void }) {
  return (
    <label className="block font-bold">媒體素材
      <select value={value ?? ''} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded border border-line p-3 font-normal">
        <option value="">不使用素材</option>
        {assets.map((asset) => <option key={asset.id} value={asset.id}>{asset.originalFilename}{asset.altText ? `｜${asset.altText}` : ''}</option>)}
      </select>
    </label>
  )
}
