import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { DashboardPage } from '../pages/DashboardPage'
import { AnalysisPage } from '../pages/AnalysisPage'
import { HistoricalEventPage } from '../pages/HistoricalEventPage'
import { HistoricalEventsListPage } from '../pages/HistoricalEventsListPage'
import { LandingPage } from '../pages/LandingPage'
import { PortfolioPage } from '../pages/PortfolioPage'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { SearchPage } from '../pages/SearchPage'
import { ProfilePage } from '../pages/ProfilePage'
import { NotFoundPage } from '../pages/NotFoundPage'

import { ProtectedRoute } from './ProtectedRoute'
import { AuthProvider } from '../contexts/AuthContext'

function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout>
              <LandingPage />
            </AppLayout>
          }
        />

        <Route
          path="/login"
          element={
            <AppLayout>
              <LoginPage />
            </AppLayout>
          }
        />
        
        <Route
          path="/register"
          element={
            <AppLayout>
              <RegisterPage />
            </AppLayout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

      

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <AppLayout>
                <SearchPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PortfolioPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />



    

        {/* Dynamic Stock Analysis Route */}
        <Route
          path="/analysis/:symbol"
          element={
            <ProtectedRoute>
              <AppLayout>
                <AnalysisPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/historical"
          element={
            <ProtectedRoute>
              <AppLayout>
                <HistoricalEventsListPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/historical/:eventId"
          element={
            <ProtectedRoute>
              <AppLayout>
                <HistoricalEventPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<AppLayout><NotFoundPage /></AppLayout>} />
      </Routes>
    </AuthProvider>
  )
}

export { AppRoutes }
