export function ShengChengLogo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 190"
      role="img"
      aria-label="盛澄策略顧問 Sheng Cheng Strategy Consulting"
      className={className}
    >
      <g transform="translate(28 20)">
        <circle cx="72" cy="72" r="60" fill="none" stroke="#3E444D" strokeWidth="13" />
        <circle cx="72" cy="72" r="38" fill="none" stroke="#3E444D" strokeWidth="12" />
        <circle cx="72" cy="72" r="16" fill="none" stroke="#3E444D" strokeWidth="10" />
        <path d="M73 70 128 38l-8 59-16-14-28 37-14-9 27-38Z" fill="#C9A23B" stroke="#FFFEFA" strokeWidth="4" strokeLinejoin="round" />
      </g>
      <text x="185" y="80" fill="#3E444D" fontSize="40" fontWeight="500" letterSpacing="6">盛澄策略顧問</text>
      <text x="188" y="123" fill="#667069" fontSize="20" letterSpacing="1.5">Sheng Cheng Strategy Consulting</text>
      <path d="M185 145h326" stroke="#C9A23B" strokeWidth="3" />
    </svg>
  )
}
