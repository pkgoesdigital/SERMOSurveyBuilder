import { Routes, Route, Navigate } from 'react-router-dom'
import BuilderPage from './pages/BuilderPage'
import PreviewPage from './pages/PreviewPage'
import RespondPage from './pages/RespondPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/builder" replace />} />
      <Route path="/builder" element={<BuilderPage />} />
      <Route path="/builder/:surveyId" element={<BuilderPage />} />
      <Route path="/preview/:surveyId" element={<PreviewPage />} />
      <Route path="/respond" element={<RespondPage />} />
      <Route path="/respond/:surveyId" element={<RespondPage />} />
    </Routes>
  )
}
