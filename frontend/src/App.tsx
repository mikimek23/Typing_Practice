import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { bootstrapSession, initializeApiAuthHandlers } from './api/auth'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/routes/ProtectedRoute'
import { AboutPage } from './pages/AboutPage'
import { AuthPage } from './pages/AuthPage'
import { HistoryPage } from './pages/HistoryPage'
import { HomePage } from './pages/HomePage'
import { ResultPage } from './pages/ResultPage'
import { TextLibraryPage } from './pages/TextLibraryPage'
import { TypingPage } from './pages/TypingPage'

const AppRoutes = () => {
  const navigate = useNavigate()

  useEffect(() => {
    initializeApiAuthHandlers(() => navigate('/login'))
    void bootstrapSession()

    return () => initializeApiAuthHandlers(null)
  }, [navigate])

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/test' element={<TypingPage />} />
        <Route path='/result' element={<ResultPage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/login' element={<AuthPage mode='login' />} />
        <Route path='/register' element={<AuthPage mode='register' />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/history' element={<HistoryPage />} />
          <Route path='/texts' element={<TextLibraryPage />} />
        </Route>
        <Route path='*' element={<HomePage />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
