

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  FolderKanban,
  Store,
  Calendar,
  BookOpen,
  User as UserIcon, // Keep UserIcon as it might be used elsewhere or a placeholder
  Menu,
  X,
  Briefcase,
  UserCheck,
  Search,
  Bell,
  MessageSquare } from
"lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger } from
"@/components/ui/dropdown-menu";
import { User } from '@/api/entities';

const navigationItems = [
{ title: "Dashboard", url: createPageUrl("Dashboard"), icon: LayoutDashboard },
{ title: "Projects", url: createPageUrl("Projects"), icon: FolderKanban },
{ title: "Profiles", url: createPageUrl("Profiles"), icon: UserCheck },
{ title: "Jobs", url: createPageUrl("Jobs"), icon: Briefcase },
// Removed Community: { title: "Community", url: createPageUrl("Community"), icon: Users },
{ title: "Marketplace", url: createPageUrl("Marketplace"), icon: Store },
{ title: "Events", url: createPageUrl("Events"), icon: Calendar },
{ title: "Resources", url: createPageUrl("Resources"), icon: BookOpen }];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (e) {
        // Not logged in
      }
    };
    fetchUser();
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0].charAt(0) + names[names.length - 1].charAt(0);
    }
    return name.charAt(0);
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      setCurrentUser(null);
      // Refresh the page to clear any cached data
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,500;0,700;0,800;0,900;1,400&family=Alegreya+Sans:wght@300;400;500;700&display=swap');
        
        :root {
          --background: #12161F;
          --surface: #1E242E;
          --primary: #FFD166;
          --secondary: #06D6A0;
          --destructive: #EF476F;
          --info: #118AB2;
          --muted: #667085;
          --text-primary: #FFFFFF;
          --text-secondary: #A0AEC0;
          --border-color: #343C4A;
          --font-serif: 'Alegreya', serif;
          --font-sans: 'Alegreya Sans', sans-serif;
        }

        body {
          font-family: var(--font-sans);
          background-color: var(--background);
          color: var(--text-primary);
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: var(--font-serif);
          font-weight: 700;
          color: var(--text-primary);
        }
        
        .font-serif {
            font-family: var(--font-serif);
        }
        
        .font-sans {
            font-family: var(--font-sans);
        }

        .bg-background { background-color: var(--background); }
        .bg-surface { background-color: var(--surface); }
        .text-primary { color: var(--primary); }
        .text-secondary { color: var(--secondary); }
        .text-destructive { color: var(--destructive); }
        .text-info { color: var(--info); }
        .text-main { color: var(--text-primary); }
        .text-muted { color: var(--text-secondary); }
        .border-default { border-color: var(--border-color); }
        
        .btn-primary {
          background-color: var(--primary);
          color: #12161F !important;
          font-weight: bold;
        }
        .btn-primary:hover {
          background-color: #ffd980;
        }

        /* Rich Text Editor Styles */
        .quill-container .ql-editor {
          color: var(--text-primary) !important;
          background-color: var(--background) !important;
          min-height: 120px;
          font-size: 1rem;
          line-height: 1.5;
        }
        .quill-container .ql-toolbar {
          background-color: var(--surface);
          border-color: var(--border-color) !important;
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
        }
        .quill-container .ql-container {
          border-color: var(--border-color) !important;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
        }
        .quill-container .ql-picker-options {
          background-color: var(--surface) !important;
          border-color: var(--border-color) !important;
        }
        .quill-container .ql-toolbar .ql-picker-label,
        .quill-container .ql-toolbar .ql-picker-item {
          color: var(--text-primary) !important;
        }
        .quill-container .ql-toolbar .ql-stroke {
          stroke: var(--text-primary) !important;
        }
        .quill-container .ql-toolbar .ql-fill {
          fill: var(--text-primary) !important;
        }
        .quill-container .ql-snow .ql-picker.ql-header .ql-picker-label::before,
        .quill-container .ql-snow .ql-picker.ql-header .ql-picker-item::before {
           color: var(--text-primary) !important;
        }
        
        /* Prose styles for rendered content */
        .prose {
          color: var(--text-secondary);
        }
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          color: var(--text-primary);
          font-family: var(--font-serif);
        }
        .prose a {
          color: var(--primary);
        }
        .prose strong {
          color: var(--text-primary);
        }
        .prose blockquote {
          color: var(--text-secondary);
          border-left-color: var(--border-color);
        }
        .prose-invert {
          --tw-prose-body: var(--text-secondary);
          --tw-prose-headings: var(--text-primary);
          --tw-prose-lead: var(--text-secondary);
          --tw-prose-links: var(--primary);
          --tw-prose-bold: var(--text-primary);
          --tw-prose-counters: var(--muted);
          --tw-prose-bullets: var(--border-color);
          --tw-prose-hr: var(--border-color);
          --tw-prose-quotes: var(--text-primary);
          --tw-prose-quote-borders: var(--border-color);
          --tw-prose-captions: var(--text-secondary);
          --tw-prose-code: var(--text-primary);
          --tw-prose-pre-code: var(--text-primary);
          --tw-prose-pre-bg: var(--surface);
          --tw-prose-th-borders: var(--border-color);
          --tw-prose-td-borders: var(--border-color);
        }
        
        /* Specific overrides for form elements */
        input, textarea, select {
          color: white !important;
          background-color: var(--background) !important;
        }
        
        input::placeholder, textarea::placeholder {
          color: #9CA3AF !important; /* Lighter placeholder text */
        }
        
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
        }
        
        button {
          color: white !important;
        }
        
        /* Select dropdown content from Radix UI */
        [role="option"], [data-radix-collection-item] {
          color: white !important;
        }
      `}</style>
      <div className="min-h-screen bg-background text-white font-sans">
        <div className="flex">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex fixed top-0 left-0 h-full w-20 bg-surface border-r border-default flex-col items-center py-4 space-y-8 z-50">
            <Link to={createPageUrl("Dashboard")} className="flex items-center justify-center">
               <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/bf8d45732_BGSlogo.png" alt="Board Game Studio Logo" className="w-14 h-auto" />
            </Link>
            <nav className="flex flex-col items-center space-y-2">
              {navigationItems.map((item) =>
              <Link
                key={item.title}
                to={item.url}
                title={item.title}
                className={`p-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.url ?
                "bg-[--primary]/10 text-[--primary]" :
                "text-text-muted hover:bg-slate-700 hover:text-text-main"}`
                }>
                  <item.icon className="w-6 h-6" />
                </Link>
              )}
            </nav>
          </aside>

          {/* Mobile Navigation Overlay */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50">
              <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
              <div className="absolute left-0 top-0 h-full w-64 bg-surface border-r border-default">
                <div className="flex items-center justify-between p-4">
                  <Link to={createPageUrl("Dashboard")} className="flex items-center justify-center">
                    <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/bf8d45732_BGSlogo.png" alt="Board Game Studio Logo" className="w-10 h-auto" />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-text-muted hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <nav className="px-4 space-y-1">
                  {navigationItems.map((item) =>
                  <Link
                    key={item.title}
                    to={item.url}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                    location.pathname === item.url ?
                    "bg-[--primary]/10 text-[--primary]" :
                    "text-text-muted hover:bg-slate-700 hover:text-text-main"}`
                    }>
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title === "Projects" ? "Game Designs" : item.title}</span>
                    </Link>
                  )}
                </nav>
              </div>
            </div>
          )}

          <div className="flex-1 lg:ml-20">
            {/* Header */}
            <header className="bg-background/80 backdrop-blur-sm border-b border-default sticky top-0 z-40 h-20 flex items-center">
              <div className="w-full mx-auto px-4 lg:px-6">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-4">
                     {/* Mobile menu button and logo/title */}
                     <div className="lg:hidden flex items-center gap-3">
                       <Button
                         variant="ghost"
                         size="icon"
                         className="text-text-muted hover:bg-surface"
                         onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                       >
                         <Menu className="w-5 h-5" />
                       </Button>
                       <Link to={createPageUrl("Dashboard")} className="flex items-center gap-2">
                         <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/bf8d45732_BGSlogo.png" alt="Board Game Studio Logo" className="w-8 h-auto" />
                         <span className="text-lg font-serif text-white">Board Game Studio</span>
                       </Link>
                     </div>
                     {/* Desktop Site Name only */}
                     <span className="hidden lg:block text-xl font-serif text-white">Board Game Studio</span>
                   </div>
                  <div className="flex items-center space-x-2 sm:space-x-4">
                      <Button variant="ghost" size="icon" className="hidden sm:flex text-text-muted hover:bg-surface hover:text-white">
                          <Search className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hidden sm:flex text-text-muted hover:bg-surface hover:text-white">
                          <MessageSquare className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hidden sm:flex text-text-muted hover:bg-surface hover:text-white">
                          <Bell className="w-5 h-5" />
                      </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2">
                          <Avatar className="w-8 h-8 lg:w-9 lg:h-9 cursor-pointer">
                            <AvatarImage src={currentUser?.profile_picture} />
                            <AvatarFallback className="bg-[--primary]/20 text-[--primary] text-sm font-medium">
                              {getInitials(currentUser?.display_name)}
                            </AvatarFallback>
                          </Avatar>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-surface border-default text-text-main">
                        <DropdownMenuLabel>{currentUser?.display_name || 'My Account'}</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-border-default" />
                        <Link to={createPageUrl('Profile')}>
                          <DropdownMenuItem className="cursor-pointer hover:!bg-slate-700">Profile</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="cursor-pointer hover:!bg-slate-700">Settings</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border-default" />
                        <DropdownMenuItem 
                          className="cursor-pointer hover:!bg-slate-700"
                          onClick={handleLogout}
                        >
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="bg-slate-950 text-white p-4 lg:p-6 xl:p-10 flex-1">
              {/* Only show page title for specific pages that need it */}
              {(currentPageName === 'ProjectDetails' || currentPageName === 'Profile') && (
                <h1 className="text-2xl lg:text-3xl font-serif text-white mb-6">
                  {currentPageName === "ProjectDetails" ? "Game Design Details" : currentPageName}
                </h1>
              )}
              {children}
            </main>
          </div>
        </div>
      </div>
    </>);

}

