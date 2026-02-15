import logoColorLight from './Logos/$aleHunt-1.svg'
import logoColorDark from './Logos/$aleHunt.svg'
import logoWhite from './Logos/$aleHunt-2.svg'
import logoBlack from './Logos/$aleHunt-3.svg'

const variants = {
    'color-light': logoColorLight,
    'color-dark': logoColorDark,
    white: logoWhite,
    black: logoBlack,
}

const Logo = ({ variant = 'color-light', className = '', height = 32 }) => {
    const src = variants[variant] || variants['color-light']

    return (
        <img
            src={src}
            alt="SaleHunt"
            style={{ height: `${height}px`, width: 'auto' }}
            className={className}
        />
    )
}

export default Logo
