import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import CardScannerPage from '../../card-scanner/CardScannerPage'
import Meetings from '../pages/Meetings'
import Emails from '../pages/Emails'
import Leads from '../pages/Leads'
import '../styles/styles-dashboard.css'

function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="home" element={<Home />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="card-scanner" element={<CardScannerPage />} />
        <Route path="meetings" element={<Meetings />} />
        <Route path="emails" element={<Emails />} />
        <Route path="leads" element={<Leads />} />
      </Routes>
    </div>
  )
}

export default DashboardPage

