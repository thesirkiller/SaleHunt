import Logo from './Logo'
import AuthFooter from './AuthFooter'

const SplitScreenLayout = ({ children, testimonial, mockupTitle }) => {
    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white relative">
            {/* Left Column */}
            <div className="w-full md:w-1/2 flex flex-col justify-between p-8 md:p-12 lg:p-24 min-h-screen">
                <div className="flex-grow">
                    <div className="mb-16">
                        <Logo variant="color-light" height={32} />
                    </div>
                    <div className="max-w-md mx-auto md:mx-0">
                        {children}
                    </div>
                </div>
                <div className="mt-8">
                    <AuthFooter />
                </div>
            </div>

            {/* Right Column */}
            <div className="hidden md:flex w-1/2 flex-col p-8 md:p-12 lg:p-24 relative overflow-hidden" style={{ backgroundColor: '#F4F7FB' }}>
                <div className="max-w-xl z-10">
                    <p className="text-xl leading-relaxed mb-8 text-gray-400" style={{ color: '#A0ABC0' }}>
                        {testimonial.text}
                    </p>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-gray-900">{testimonial.author}</p>
                            <p className="text-sm text-gray-400">{testimonial.role}</p>
                        </div>
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-xl text-green-500" style={{ color: '#05C270' }}>★</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Browser Mockup */}
                <div className="mt-12 relative flex-grow">
                    <div className="absolute top-0 left-0 w-full h-[600px] rounded-tl-2xl shadow-2xl overflow-hidden border border-gray-200 bg-white" style={{ transform: 'translate(48px, 48px)' }}>
                        {/* Browser Chrome */}
                        <div className="h-12 flex items-center px-4 gap-2 border-b border-gray-100">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="mx-auto w-64 h-6 rounded-md bg-gray-50 border border-gray-100 text-[10px] flex items-center justify-center text-gray-400">
                                salehunt.com
                            </div>
                        </div>

                        {/* Mockup Content - Matching Image 3/4 */}
                        <div className="flex h-full bg-[#F4F7FB]">
                            {/* Mockup Sidebar */}
                            <div className="w-12 border-r border-gray-100 bg-white flex flex-col items-center py-4 gap-4">
                                <div className="w-6 h-6 rounded bg-primary mb-4" />
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="w-5 h-5 rounded bg-gray-100" />
                                ))}
                            </div>

                            {/* Mockup Main Content */}
                            <div className="flex-grow flex flex-col">
                                <div className="h-10 border-b border-gray-100 bg-white px-4 flex items-center justify-between">
                                    <div className="h-3 w-32 bg-gray-100 rounded" />
                                    <div className="flex gap-2">
                                        <div className="h-5 w-12 bg-gray-50 border border-gray-100 rounded" />
                                        <div className="h-5 w-12 bg-gray-900 rounded" />
                                    </div>
                                </div>
                                <div className="flex-grow p-4 flex gap-4">
                                    {/* Mockup Settings Column */}
                                    <div className="w-48 space-y-4">
                                        <div className="space-y-2">
                                            <div className="h-3 w-20 bg-gray-300 rounded" />
                                            <div className="h-8 w-full bg-white border border-gray-100 rounded" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-3 w-24 bg-gray-300 rounded" />
                                            <div className="h-20 w-full bg-white border border-gray-200 rounded p-2 flex flex-col gap-2">
                                                <div className="h-2 w-full bg-gray-100 rounded" />
                                                <div className="h-2 w-2/3 bg-gray-100 rounded" />
                                                <div className="flex gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <div key={i} className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-primary' : 'bg-gray-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Mockup Preview Area */}
                                    <div className="flex-grow bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="h-full w-full bg-gray-50 flex items-center justify-center">
                                            <div className="text-[10px] text-gray-300 font-medium">Preview da Proposta</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative glow */}
                <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl -mr-48 -mb-48" style={{ backgroundColor: 'rgba(67,126,247,0.05)' }} />
            </div>
        </div>
    )
}

export default SplitScreenLayout
