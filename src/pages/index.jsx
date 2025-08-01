import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Projects from "./Projects";

import Community from "./Community";

import Events from "./Events";

import Marketplace from "./Marketplace";

import Resources from "./Resources";

import Profiles from "./Profiles";

import Jobs from "./Jobs";

import Profile from "./Profile";

import ProjectDetails from "./ProjectDetails";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Projects: Projects,
    
    Community: Community,
    
    Events: Events,
    
    Marketplace: Marketplace,
    
    Resources: Resources,
    
    Profiles: Profiles,
    
    Jobs: Jobs,
    
    Profile: Profile,
    
    ProjectDetails: ProjectDetails,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Projects" element={<Projects />} />
                
                <Route path="/Community" element={<Community />} />
                
                <Route path="/Events" element={<Events />} />
                
                <Route path="/Marketplace" element={<Marketplace />} />
                
                <Route path="/Resources" element={<Resources />} />
                
                <Route path="/Profiles" element={<Profiles />} />
                
                <Route path="/Jobs" element={<Jobs />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/ProjectDetails" element={<ProjectDetails />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}