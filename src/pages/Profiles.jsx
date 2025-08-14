
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { 
  Users, 
  Search, 
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileCard from "../components/profiles/ProfileCard";

export default function Profiles() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadCurrentUserAndProfiles();
  }, []);

  const loadCurrentUserAndProfiles = async () => {
    setLoading(true);
    setError(null);
    let loggedInUser = null;

    try {
      // 1. Check for a logged-in user. This is allowed to fail.
      loggedInUser = await User.me();
      setCurrentUser(loggedInUser);
    } catch (e) {
      // User is not logged in, proceed as a public visitor.
      setCurrentUser(null);
    }

    try {
      let profilesToDisplay = [];
      if (loggedInUser) {
        // 2a. If user is logged in, fetch all users and filter based on richer visibility rules.
        const allUsers = await User.list('-created_date');
        profilesToDisplay = allUsers.filter(profile => {
          const visibility = profile.profile_visibility;
          if (profile.id === loggedInUser.id) return true; // Always show the user their own profile.
          // Logged-in users can see public and members-only profiles.
          return !visibility || visibility === 'public' || visibility === 'members_only';
        });
      } else {
        // 2b. If user is NOT logged in, fetch ONLY the profiles marked as public.
        profilesToDisplay = await User.filter({ profile_visibility: 'public' }, '-created_date');
      }
      setUsers(profilesToDisplay);
    } catch (err) {
      console.error("An unexpected error occurred loading profiles:", err);
      setError("Could not load profiles. Please try refreshing the page.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
  
  const getFilteredProfiles = (tab) => {
    const filterBySearch = (profiles) => {
        return profiles.filter(p => 
            p.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    };

    switch(tab) {
        case 'freelancers':
            return filterBySearch(users.filter(u => u.user_roles?.includes('freelancer')));
        case 'designers':
            return filterBySearch(users.filter(u => u.user_roles?.includes('game_designer')));
        case 'all':
        default:
            return filterBySearch(users);
    }
  }

  const renderProfiles = (tab) => {
    const profiles = getFilteredProfiles(tab);
    
    if (loading) {
      return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-800 rounded-xl h-72"></div>
          ))}
        </div>
      );
    }

    if (error && profiles.length === 0) {
      return (
        <div className="text-center py-16 col-span-full">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Could Not Load Profiles</h3>
            <p className="text-slate-400 mb-6">{error}</p>
            <Button onClick={loadCurrentUserAndProfiles} className="btn-primary">Try Again</Button>
        </div>
      )
    }

    if (profiles.length === 0) {
      return (
        <div className="text-center py-16 col-span-full">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-200 mb-2">No profiles found</h3>
            <p className="text-slate-400">Try adjusting your search or filters.</p>
        </div>
      )
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {profiles.map((user) => <ProfileCard key={user.id} user={user} />)}
        </div>
    )
  }

  return (
    <div className="space-y-8">
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <TabsList className="bg-transparent p-0 border-b border-gray-700 rounded-none">
              <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-white text-slate-400 rounded-none pb-3">All</TabsTrigger>
              <TabsTrigger value="freelancers" className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-white text-slate-400 rounded-none pb-3">Freelancers</TabsTrigger>
              <TabsTrigger value="designers" className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-white text-slate-400 rounded-none pb-3">Designers</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 focus:border-yellow-400 w-full"
              />
            </div>
            <Button variant="ghost" className="bg-gray-800 border border-gray-700 hover:bg-gray-700 text-slate-300">
              Newest Registered <ChevronDown className="w-4 h-4 ml-2"/>
            </Button>
          </div>
        </div>
        
        <TabsContent value={activeTab}>{renderProfiles(activeTab)}</TabsContent>
      </Tabs>
    </div>
  );
}
