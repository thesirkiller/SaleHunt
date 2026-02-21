/**
 * StepIndicator
 * 4 traços horizontais — ativo (≤ current) verde, inativo cinza.
 *
 * Props:
 *   total   {number} — quantidade total de traços (padrão 4)
 *   current {number} — step atual, 1-indexed
 */
const StepIndicator = ({ total = 4, current = 1 }) => {
    return (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {Array.from({ length: total }, (_, i) => (
                <div
                    key={i}
                    style={{
                        width: '40px',
                        height: '4px',
                        borderRadius: '999px',
                        backgroundColor: i < current ? '#22c55e' : '#D1D5DB',
                        flexShrink: 0,
                    }}
                />
            ))}
        </div>
    )
}

export default StepIndicator
