/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RoadmapPage from './pages/RoadmapPage';
import VoiceAiPage from './pages/VoiceAiPage';
import CodingPage from './pages/CodingPage';
import AptitudePage from './pages/AptitudePage';
import HrInterviewPage from './pages/HrInterviewPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/voice-ai" element={<VoiceAiPage />} />
          <Route path="/coding" element={<CodingPage />} />
          <Route path="/aptitude" element={<AptitudePage />} />
          <Route path="/hr-interview" element={<HrInterviewPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Other routes will be added here */}
        </Routes>
      </Layout>
    </Router>
  );
}
