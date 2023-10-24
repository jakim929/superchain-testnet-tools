import { AppRoutes } from '@/AppRouter'
import { Providers } from '@/Providers'

function App() {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  )
}

export default App
