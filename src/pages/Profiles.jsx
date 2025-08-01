import React, { useState, useEffect } from "react";
import { User, ServiceProvider } from "@/api/entities";
import { 
  Users, 
  Search, 
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileCard from "../components/profiles/ProfileCard";
import ServiceCard from "../components/profiles/ServiceCard";

export default function Profiles() {
  const [users, setUsers] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const userList = await User.list('-created_date');
      const serviceList = await ServiceProvider.list('-created_date');
      
      setUsers(userList);
      setServiceProviders(serviceList);
    } catch (error) {
      console.error("Error loading profiles:", error);
    }
    setLoading(false);
  };
  
  const getFilteredProfiles = (tab) => {
    const filterBySearch = (profiles, isService = false) => {
        return profiles.filter(p => {
            if(isService) {
                return p.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       p.services?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
            }
            return p.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   p.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
        });
    };

    switch(tab) {
        case 'creatives':
            return filterBySearch(users.filter(u => u.user_type?.includes('creative')));
        case 'designers':
            return filterBySearch(users.filter(u => u.user_type?.includes('designer')));
        case 'services':
            return filterBySearch(serviceProviders, true);
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

    if (profiles.length === 0) {
      return (
        <div className="text-center py-16 col-span-full">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-200 mb-2">No profiles found</h3>
            <p className="text-slate-400">Try adjusting your search or filters.</p>
        </div>
      )
    }

    if (tab === 'services') {
        return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {profiles.map((service) => <ServiceCard key={service.id} service={service} />)}
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
      <h1 className="text-5xl font-bold text-white" style={{fontFamily: "'Garamond', serif"}}>Freelancers</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <TabsList className="bg-transparent p-0 border-b border-gray-700 rounded-none">
              <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-white text-slate-400 rounded-none pb-3">All</TabsTrigger>
              <TabsTrigger value="creatives" className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-white text-slate-400 rounded-none pb-3">Creatives</TabsTrigger>
              <TabsTrigger value="designers" className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-white text-slate-400 rounded-none pb-3">Designers</TabsTrigger>
              <TabsTrigger value="services" className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-white text-slate-400 rounded-none pb-3">Services</TabsTrigger>
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