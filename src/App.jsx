import './App.css';
import AuthPage from './modules/auth/components/AuthPage';
import CardScannerPage from './modules/card-scanner/CardScannerPage';
import CompanyProfile from './modules/company-profile/CompanyProfile';
import DashboardPage from './modules/dashboard/components/DashboardPage';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'; 
import Home from './modules/dashboard/pages/Home';
// import Navbar from './modules/dashboard/components/Navbar';
// import Leads from './modules/dashboard/pages/Leads';
import SettingsPage from './modules/settings/SettingsPage';
import MeetingCapturePage from './modules/meeting-capture/MeetingCapturePage';
import EmailDraftPage from './modules/email-draft/EmailDraftPage';



function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path='/login' element={<AuthPage/>}/>
        <Route path='/dashboard' element={<DashboardPage/>}/>
        <Route path='/card-scanner' element={<CardScannerPage/>}/>
        <Route path="/company-person-profile" element={<CompanyProfile/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path='/meetings' element={<MeetingCapturePage/>}/>
        <Route path='/emails/*' element={<EmailDraftPage/>}/>
      </Routes>     
    </Router>
  )
}

export default App
