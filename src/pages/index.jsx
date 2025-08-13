import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Projects from "./Projects";

import Events from "./Events";

import Marketplace from "./Marketplace";

import Resources from "./Resources";

import Profiles from "./Profiles";

import Jobs from "./Jobs";

import Profile from "./Profile";

import ProjectDetails from "./ProjectDetails";

import ResourceDetails from "./ResourceDetails";

import JobDetails from "./JobDetails";

import Login from "./Login";

import Register from "./Register";

import Admin from "./Admin";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Projects: Projects,
    
    Events: Events,
    
    Marketplace: Marketplace,
    
    Resources: Resources,
    
    Profiles: Profiles,
    
    Jobs: Jobs,
    
    Profile: Profile,
    
    ProjectDetails: ProjectDetails,
    
    ResourceDetails: ResourceDetails,
    
    JobDetails: JobDetails,
    
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
    
    // Auth pages don't need the Layout wrapper
    const isAuthPage = ['/login', '/register'].includes(location.pathname);
    
    if (isAuthPage) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        );
    }
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Projects" element={<Projects />} />
                
                <Route path="/Events" element={<Events />} />
                
                <Route path="/Marketplace" element={<Marketplace />} />
                
                <Route path="/Resources" element={<Resources />} />
                
                <Route path="/Profiles" element={<Profiles />} />
                
                <Route path="/Jobs" element={<Jobs />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/ProjectDetails" element={<ProjectDetails />} />
                
                <Route path="/ResourceDetails" element={<ResourceDetails />} />
                
                <Route path="/JobDetails" element={<JobDetails />} />
                
                <Route path="/admin" element={<Admin />} />
                
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
