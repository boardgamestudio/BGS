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
    
    return (
        <Routes>
            {/* Auth pages without Layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            
            {/* Regular pages with Layout */}
            <Route path="/" element={<Layout currentPageName={currentPage}><Dashboard /></Layout>} />
            <Route path="/Dashboard" element={<Layout currentPageName={currentPage}><Dashboard /></Layout>} />
            <Route path="/Projects" element={<Layout currentPageName={currentPage}><Projects /></Layout>} />
            <Route path="/Events" element={<Layout currentPageName={currentPage}><Events /></Layout>} />
            <Route path="/Marketplace" element={<Layout currentPageName={currentPage}><Marketplace /></Layout>} />
            <Route path="/Resources" element={<Layout currentPageName={currentPage}><Resources /></Layout>} />
            <Route path="/Profiles" element={<Layout currentPageName={currentPage}><Profiles /></Layout>} />
            <Route path="/Jobs" element={<Layout currentPageName={currentPage}><Jobs /></Layout>} />
            <Route path="/Profile" element={<Layout currentPageName={currentPage}><Profile /></Layout>} />
            <Route path="/ProjectDetails" element={<Layout currentPageName={currentPage}><ProjectDetails /></Layout>} />
            <Route path="/ResourceDetails" element={<Layout currentPageName={currentPage}><ResourceDetails /></Layout>} />
            <Route path="/JobDetails" element={<Layout currentPageName={currentPage}><JobDetails /></Layout>} />
        </Routes>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}
