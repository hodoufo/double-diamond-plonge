import { formatMillionsBRL, getPipelineSummary } from '../data/mock'

export function CommercialPipelineSectionTitle() {
  const { totalDeals, nextMonthRevenueMm } = getPipelineSummary()

  return (
    <h2 className="text-base font-semibold leading-snug text-[var(--color-plonge-ink)] sm:text-lg">
      Hoje há <span className="font-semibold tabular-nums">{totalDeals}</span> negócios no pipeline,
      com o total de{' '}
      <span className="font-semibold tabular-nums">{formatMillionsBRL(nextMonthRevenueMm)}</span> de
      faturamento para o próximo mês.
    </h2>
  )
}
