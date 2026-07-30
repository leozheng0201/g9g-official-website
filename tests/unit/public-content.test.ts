import { describe, expect, it } from 'vitest'
import { companyInfo, contactInfo, siteConfig } from '@/content/site'

describe('approved public site data', () => {
  it('uses G9G as the primary brand and approved company information', () => {
    expect(siteConfig.name).toBe('G9G')
    expect(siteConfig.positioning).toBe('LINE 禮物品牌成長平台')
    expect(companyInfo.legalName).toBe('盛澄策略顧問')
    expect(companyInfo.taxId).toBe('60381422')
    expect(contactInfo.lineUrl).toBe('https://lin.ee/QwORXXZ')
  })

  it('does not expose the hidden LINE identity or prohibited audit wording', () => {
    const serialized = JSON.stringify({ siteConfig, companyInfo, contactInfo })

    expect(serialized).not.toContain('scrutator')
    expect(serialized).not.toContain('免費健檢')
    expect(serialized).not.toContain('免費品牌健檢')
  })
})
