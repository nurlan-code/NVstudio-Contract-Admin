/** API sahəsi — neytral, səliqəli read-only göstərici */
export default function ReadOnlyField({
  value,
  placeholder = '—',
  mono = false,
  size = 'md',
  className = '',
}) {
  const display = value != null && String(value).trim() !== '' ? String(value) : ''

  const sizeCls = size === 'sm'
    ? 'px-2 py-[5px] text-[12px] min-h-[28px]'
    : 'px-2.5 py-[7px] text-[13px] min-h-[32px]'

  return (
    <input
      type="text"
      readOnly
      tabIndex={-1}
      value={display}
      placeholder={placeholder}
      title={display || undefined}
      className={`w-full min-w-0 rounded-[8px] border border-[#e8edf5] bg-white outline-none cursor-default
        text-[#1e293b] shadow-[0_1px_2px_rgba(15,23,42,0.03)]
        break-all whitespace-normal leading-snug
        placeholder:text-[#cbd5e1] placeholder:font-normal
        ${mono ? 'font-mono text-[12px] tracking-wide' : 'font-normal'}
        ${sizeCls}
        ${className}`}
    />
  )
}
