import { NavBarLayout } from '@/layouts/NavBarLayout'
import { AddressPage } from '@/pages/AddressPage'
import { BridgePage } from '@/pages/BridgePage'
import { ChainsPage } from '@/pages/ChainsPage'
import { CrossDomainTransactionPage } from '@/pages/CrossDomainTransactionPage'
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
        path: '/chains',
        element: <ChainsPage />,
      },
      {
        path: '/tx/:transactionHash',
        element: <CrossDomainTransactionPage />,
      },
      {
        path: '/address/:address',
        element: <AddressPage />,
      },
    ],
  },
])

export const AppRoutes = () => {
  return <RouterProvider router={router} />
}
