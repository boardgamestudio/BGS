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
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// This is a more standard and robust way to handle routing and layouts.
// The complex `_getCurrentPage` function has been removed.

export default function Pages() {
    return (
        <Router>
            <Routes>
                {/* Auth pages without Layout */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<Admin />} />
                
                {/* Regular pages with Layout */}
                <Route path="/" element={<Layout currentPageName="Dashboard"><Dashboard /></Layout>} />
                <Route path="/dashboard" element={<Layout currentPageName="Dashboard"><Dashboard /></Layout>} />
                
                <Route path="/projects" element={<Layout currentPageName="Projects"><Projects /></Layout>} />
                <Route path="/projects/:id" element={<Layout currentPageName="ProjectDetails"><ProjectDetails /></Layout>} />

                <Route path="/events" element={<Layout currentPageName="Events"><Events /></Layout>} />
                <Route path="/marketplace" element={<Layout currentPageName="Marketplace"><Marketplace /></Layout>} />
                <Route path="/resources" element={<Layout currentPageName="Resources"><Resources /></Layout>} />
                <Route path="/profiles" element={<Layout currentPageName="Profiles"><Profiles /></Layout>} />
                <Route path="/jobs" element={<Layout currentPageName="Jobs"><Jobs /></Layout>} />
                <Route path="/profile" element={<Layout currentPageName="Profile"><Profile /></Layout>} />
                <Route path="/resourcedetails" element={<Layout currentPageName="ResourceDetails"><ResourceDetails /></Layout>} />
                <Route path="/jobdetails" element={<Layout currentPageName="JobDetails"><JobDetails /></Layout>} />

                {/* Legacy route for old links, can be removed later */}
                <Route path="/projectdetails" element={<Layout currentPageName="ProjectDetails"><ProjectDetails /></Layout>} />

            </Routes>
        </Router>
    );
}
