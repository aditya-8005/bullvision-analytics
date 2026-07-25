import { Toaster } from 'sonner'
import ErrorBoundary from './components/ErrorBoundary'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
      <Toaster theme="dark" position="bottom-right" />
    </ErrorBoundary>
  )
}

export default App