import { NavBar } from '@/components/NavBar'
import { Outlet } from 'react-router-dom'

export const NavBarLayout = () => {
  return (
    <div className="relative flex flex-col">
      <NavBar />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  )
}
