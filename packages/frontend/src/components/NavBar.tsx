import { cn } from '@/lib/utils'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Link, useLocation } from 'react-router-dom'

const Banner = () => {
  return (
    <Link to="/" className="font-mono text-sm font-bold leading-none">
      SUPERCHAIN <br />
      TESTNET <br />
      TOOLS
    </Link>
  )
}

const NavBarButton = ({
  to,
  title,
}: {
  to: string
  title: string
}) => {
  const { pathname: currentPathname } = useLocation()
  const isSelected = currentPathname === to
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center text-base font-semibold font-mono px-8',
        isSelected
          ? 'shadow-bottom-outline-black'
          : 'hover:shadow-bottom-outline-grey',
      )}
    >
      {title}
    </Link>
  )
}

const NavBarButtons = () => {
  return (
    <div className="flex h-full gap-2">
      <NavBarButton to="/" title="bridge" />
      <NavBarButton to="/chains" title="chains" />
      <NavBarButton to="/message-passer" title="message passer" />
    </div>
  )
}

export const NavBar = () => {
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-16 flex items-center px-4 justify-between">
      <Banner />
      <NavBarButtons />
      <ConnectButton />
    </div>
  )
}
