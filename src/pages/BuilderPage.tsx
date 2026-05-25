import { SurveyProvider } from '../contexts/SurveyContext'
import AppShell from '../components/layout/AppShell'
import Sidebar from '../components/layout/Sidebar'
import Canvas from '../components/layout/Canvas'
import PropertiesPanel from '../components/layout/PropertiesPanel'

export default function BuilderPage() {
  return (
    <SurveyProvider>
      <AppShell>
        <Sidebar />
        <Canvas />
        <PropertiesPanel />
      </AppShell>
    </SurveyProvider>
  )
}
