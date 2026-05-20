export default function DeleteModal({ name, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0f172a]/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl w-full max-w-[420px] overflow-hidden"
        style={{ boxShadow: '0 24px 64px rgba(0,26,92,0.2)' }}>
        {/* Red top accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#dc2626] to-[#f87171]" />
        <div className="p-7">
          <div className="w-14 h-14 bg-[#fff1f2] rounded-2xl flex items-center justify-center mx-auto mb-4
            border border-[#fecdd3]">
            <svg className="w-7 h-7 text-[#dc2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-[19px] font-bold text-[#0f172a] text-center mb-2 tracking-tight">
            Müqaviləni Sil
          </h3>
          <p className="text-[13.5px] text-[#64748b] text-center leading-relaxed mb-7">
            <span className="font-semibold text-[#0f172a]">{name}</span> adlı müqaviləni həmişəlik
            silmək istədiyinizdən əminsiniz?
            <span className="block mt-1 text-[#94a3b8] text-[12.5px]">Bu əməliyyat geri qaytarıla bilməz.</span>
          </p>
          <div className="flex gap-3">
            <button onClick={onCancel}
              className="flex-1 py-2.5 border border-[#e2e8f0] rounded-[10px] text-[14px] font-semibold
                text-[#374151] hover:bg-[#f8fafc] hover:border-[#94a3b8] transition-all">
              Ləğv Et
            </button>
            <button onClick={onConfirm}
              className="flex-1 py-2.5 rounded-[10px] text-[14px] font-bold text-white transition-all
                hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' }}>
              Bəli, Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
