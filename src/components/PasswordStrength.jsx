const getStrength = (password) => {
    let score = 0
    if (password.length >= 8) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++

    if (score <= 1) return { level: 'weak', label: 'Fraca', color: 'var(--color-error)' }
    if (score === 2) return { level: 'medium', label: 'Média', color: 'var(--color-warning)' }
    return { level: 'strong', label: 'Forte', color: 'var(--color-success)' }
}

const PasswordStrength = ({ password = '' }) => {
    if (!password) return null

    const strength = getStrength(password)
    const hasMinLength = password.length >= 8
    const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password)
    const hasSymbolOrNumber = /[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)

    const barWidth = strength.level === 'weak' ? '33%' : strength.level === 'medium' ? '66%' : '100%'

    return (
        <div className="space-y-2 mt-2">
            {/* Strength bar */}
            <div
                className="w-full h-1 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--color-gray-100)' }}
            >
                <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                        width: barWidth,
                        backgroundColor: strength.color,
                    }}
                />
            </div>

            {/* Strength label */}
            <p className="text-sm">
                <span style={{ color: 'var(--color-gray-400)' }}>Força da senha: </span>
                <strong style={{ color: strength.color }}>{strength.label}</strong>
            </p>

            {/* Validation checklist */}
            <ul className="space-y-1 text-sm" style={{ color: 'var(--color-gray-400)' }}>
                <li style={hasMinLength ? { textDecoration: 'line-through', opacity: 0.6 } : {}}>
                    • Mínimo 8 caracteres
                </li>
                <li style={hasMixedCase ? { textDecoration: 'line-through', opacity: 0.6 } : {}}>
                    • Letras maiúsculas e minúsculas
                </li>
                <li style={hasSymbolOrNumber ? { textDecoration: 'line-through', opacity: 0.6 } : {}}>
                    • Pelo menos um símbolo ou número
                </li>
            </ul>
        </div>
    )
}

export { getStrength }
export default PasswordStrength
