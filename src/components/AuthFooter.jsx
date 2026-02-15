import { Mail } from 'lucide-react'

const AuthFooter = () => {
    return (
        <footer className="flex justify-between items-center text-xs py-6" style={{ color: 'var(--color-gray-400)' }}>
            <span>© SaleHunt 2025</span>
            <div className="flex items-center gap-1">
                <Mail size={12} />
                <span>ajuda@salehunt.com</span>
            </div>
        </footer>
    )
}

export default AuthFooter
