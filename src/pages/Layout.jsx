

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Store,
  Calendar,
  BookOpen,
  User as UserIcon,
  Menu,
  X,
  Briefcase,
  UserCheck,
  Search,
  Bell,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from '@/api/entities';


const navigationItems = [
  { title: "Dashboard", url: createPageUrl("Dashboard"), icon: LayoutDashboard },
  { title: "Projects", url: createPageUrl("Projects"), icon: FolderKanban },
  { title: "Profiles", url: createPageUrl("Profiles"), icon: UserCheck },
  { title: "Jobs", url: createPageUrl("Jobs"), icon: Briefcase },
  { title: "Community", url: createPageUrl("Community"), icon: Users },
  { title: "Marketplace", url: createPageUrl("Marketplace"), icon: Store },
  { title: "Events", url: createPageUrl("Events"), icon: Calendar },
  { title: "Resources", url: createPageUrl("Resources"), icon: BookOpen },
];

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

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0].charAt(0) + names[names.length - 1].charAt(0);
    }
    return name.charAt(0);
  }

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
          color: #12161F;
          font-weight: bold;
        }
        .btn-primary:hover {
          background-color: #ffd980;
        }

        .quill-container .ql-editor {
          color: #1E242E;
        }
        .quill-container .ql-toolbar {
          background-color: #f0f0f0;
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
        }
         .quill-container .ql-container {
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
        }
      `}</style>
      <div className="min-h-screen bg-background text-text-main font-sans">
        <div className="flex">
          {/* Sidebar */}
          <aside className="fixed top-0 left-0 h-full w-20 bg-surface border-r border-default flex flex-col items-center py-6 space-y-8 z-50">
            <Link to={createPageUrl("Dashboard")} className="flex items-center justify-center">
              <div className="w-10 h-10 bg-[--primary] rounded-lg flex items-center justify-center transform rotate-[-15deg]">
                 <div className="w-5 h-5 bg-background rounded-sm"></div>
              </div>
            </Link>
            <nav className="flex flex-col items-center space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  title={item.title}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    location.pathname === item.url
                      ? "bg-[--primary]/10 text-[--primary]"
                      : "text-text-muted hover:bg-slate-700 hover:text-text-main"
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                </Link>
              ))}
            </nav>
          </aside>

          <div className="flex-1 ml-20">
            {/* Header */}
            <header className="bg-background/80 backdrop-blur-sm border-b border-default sticky top-0 z-40 h-20 flex items-center">
              <div className="w-full mx-auto px-6">
                <div className="flex justify-between items-center">
                   <div>
                     <h1 className="text-2xl font-serif text-text-main">{currentPageName}</h1>
                   </div>
                  <div className="flex items-center space-x-2 sm:space-x-4">
                      <Button variant="ghost" size="icon" className="text-text-muted hover:bg-surface hover:text-white">
                          <Search className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-text-muted hover:bg-surface hover:text-white">
                          <MessageSquare className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-text-muted hover:bg-surface hover:text-white">
                          <Bell className="w-5 h-5" />
                      </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2">
                          <Avatar className="w-9 h-9 cursor-pointer">
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
                        <DropdownMenuSeparator className="bg-border-default"/>
                        <DropdownMenuItem className="cursor-pointer hover:!bg-slate-700">Logout</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden text-text-muted hover:bg-surface"
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                      {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-10">
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

