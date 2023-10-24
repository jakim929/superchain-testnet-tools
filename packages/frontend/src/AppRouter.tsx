import { NavBarLayout } from '@/layouts/NavBarLayout'
import { BridgePage } from '@/pages/BridgePage'
import { MessagePasserPage } from '@/pages/MessagePasserPage'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    element: <NavBarLayout />,
    children: [
      {
        path: '',
        element: <BridgePage />,
      },
      {
        path: '/message-passer',
        element: <MessagePasserPage />,
      },
    ],
  },
])

export const AppRoutes = () => {
  return <RouterProvider router={router} />
}
