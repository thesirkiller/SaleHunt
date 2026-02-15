import Logo from './Logo'
import AuthFooter from './AuthFooter'

const CenteredLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col p-8 md:p-12 lg:p-24 bg-white">
            <div className="mb-16">
                <Logo variant="color-light" height={32} />
            </div>

            <div className="flex-grow flex flex-col items-center justify-center max-w-lg mx-auto w-full">
                {children}
            </div>

            <div className="mt-8">
                <AuthFooter />
            </div>
        </div>
    )
}

export default CenteredLayout
