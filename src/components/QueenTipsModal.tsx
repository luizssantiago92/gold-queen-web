import { Crown, Loader2, ScrollText, ShieldCheck, Swords } from 'lucide-react'
import type { ReactNode } from 'react'

import { Modal } from '@/components/ui/Modal'
import { errorMessage } from '@/lib/api'
import { useQueenTips } from '@/lib/queries'

interface Props {
  open: boolean
  onClose: () => void
}

export function QueenTipsModal({ open, onClose }: Props) {
  const { data, isLoading, error } = useQueenTips(open)

  return (
    <Modal
      open={open}
      title="Dicas da Rainha"
      subtitle="Diagnostico real do seu tesouro"
      onClose={onClose}
    >
      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-parchment/50">
          <Loader2 className="animate-spin text-gold" size={18} />A Rainha consulta os
          pergaminhos...
        </div>
      )}

      {error && (
        <p role="alert" className="py-6 text-center text-sm text-red-300">
          {errorMessage(error, 'Os conselheiros reais estao indisponiveis no momento.')}
        </p>
      )}

      {data && (
        <div className="space-y-3 pb-2">
          <Scroll
            icon={<Swords size={15} />}
            title="Corte de Gastos Critico"
            body={data.critical_expense}
          />
          <Scroll
            icon={<ScrollText size={15} />}
            title="Gestao do Tesouro"
            body={data.management_status}
          />
          <Scroll
            icon={<Crown size={15} />}
            title="Direcionamento Inteligente"
            body={data.smart_guidance}
          />

          {data.is_guarded && (
            <p className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-parchment/40">
              <ShieldCheck size={13} className="text-gold/70" />
              Resposta validada pelos guardrails
              {data.from_cache && ' · recuperada do pergaminho do dia'}
            </p>
          )}
        </div>
      )}
    </Modal>
  )
}

function Scroll({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <article className="rounded-2xl border border-gold-aged/30 bg-gradient-to-br from-surface-raised to-surface p-4">
      <h3 className="mb-1.5 flex items-center gap-2 font-royal text-sm font-semibold text-gold">
        {icon}
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-parchment/75">{body}</p>
    </article>
  )
}
