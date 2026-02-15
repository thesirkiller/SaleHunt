import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const PasswordInput = ({ label, placeholder = '', value, onChange, error, id }) => {
    const [visible, setVisible] = useState(false)

    return (
        <div className="space-y-2">
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium"
                    style={{ color: 'var(--color-gray-900)' }}
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    id={id}
                    type={visible ? 'text' : 'password'}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-full px-4 py-3 rounded-lg pr-12 transition-all focus:outline-none focus:ring-2"
                    style={{
                        border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-gray-300)'}`,
                        color: 'var(--color-gray-900)',
                        fontSize: 'var(--text-body)',
                    }}
                />
                <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'var(--color-gray-400)' }}
                    tabIndex={-1}
                    aria-label={visible ? 'Esconder senha' : 'Mostrar senha'}
                >
                    {visible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            {error && (
                <p className="text-sm" style={{ color: 'var(--color-error)' }}>
                    {error}
                </p>
            )}
        </div>
    )
}

export default PasswordInput
