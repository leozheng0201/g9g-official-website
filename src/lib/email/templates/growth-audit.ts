export type GrowthAuditEmailApplication = {
  id: string
  contactName: string
  brandName: string
  email: string
  phone: string
  brandUrl: string
  createdAt: Date
}

export type TransactionalEmail = {
  from: string
  to: string[]
  replyTo?: string
  subject: string
  html: string
  idempotencyKey: string
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export function buildGrowthAuditApplicantReceipt(
  application: GrowthAuditEmailApplication,
  options: { from: string; replyTo: string },
): TransactionalEmail {
  const contactName = escapeHtml(application.contactName)
  const brandName = escapeHtml(application.brandName)

  return {
    from: options.from,
    to: [application.email],
    replyTo: options.replyTo,
    subject: `G9G｜已收到品牌成長健檢申請－${application.brandName}`,
    html: `
      <main style="font-family:Arial,sans-serif;line-height:1.7;color:#151a17">
        <h1 style="font-size:24px">已收到你的申請</h1>
        <p>${contactName} 您好：</p>
        <p>我們已收到「${brandName}」的品牌成長健檢申請。</p>
        <p>G9G 會先確認品牌現況與資料完整度，再由團隊評估後續聯繫方式。此信僅代表資料已成功送達，不代表申請已通過或服務名額已成立。</p>
        <p>如需補充資訊，可直接回覆此信。</p>
        <p>G9G｜LINE 禮物品牌成長平台</p>
      </main>
    `.trim(),
    idempotencyKey: `growth-audit:${application.id}:applicant-receipt:v1`,
  }
}

export function buildGrowthAuditAdminNotification(
  application: GrowthAuditEmailApplication,
  options: { from: string; adminEmail: string; replyTo: string },
): TransactionalEmail {
  return {
    from: options.from,
    to: [options.adminEmail],
    replyTo: options.replyTo,
    subject: `【品牌成長健檢】${application.brandName}｜${application.contactName}`,
    html: `
      <main style="font-family:Arial,sans-serif;line-height:1.7;color:#151a17">
        <h1 style="font-size:24px">新的品牌成長健檢申請</h1>
        <dl>
          <dt>品牌</dt><dd>${escapeHtml(application.brandName)}</dd>
          <dt>聯絡人</dt><dd>${escapeHtml(application.contactName)}</dd>
          <dt>Email</dt><dd>${escapeHtml(application.email)}</dd>
          <dt>手機</dt><dd>${escapeHtml(application.phone)}</dd>
          <dt>品牌連結</dt><dd>${escapeHtml(application.brandUrl)}</dd>
          <dt>申請時間</dt><dd>${escapeHtml(application.createdAt.toISOString())}</dd>
        </dl>
      </main>
    `.trim(),
    idempotencyKey: `growth-audit:${application.id}:admin-notification:v1`,
  }
}
