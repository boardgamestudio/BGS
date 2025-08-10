
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User, ServiceProvider } from "@/api/entities";
import {
  Palette,
  PenTool,
  BookOpen,
  Users,
  Search,
  Filter,
  ArrowRight,
  Briefcase,
  Camera,
  Gamepad2,
  Megaphone,
  Globe,
  Mail,
  Phone,
  Star, // For social icons on service card
  MessageSquare // For social icons on service card
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const serviceCategories = [
{
  id: "artwork",
  title: "Artwork & Illustration",
  icon: Palette,
  color: "text-purple-400",
  bgColor: "bg-purple-400/10",
  borderColor: "border-purple-400/20"
},
{
  id: "graphic_design",
  title: "Graphic Design",
  icon: PenTool,
  color: "text-blue-400",
  bgColor: "bg-blue-400/10",
  borderColor: "border-blue-400/20"
},
{
  id: "writing",
  title: "Writing & Editing",
  icon: BookOpen,
  color: "text-emerald-400",
  bgColor: "bg-emerald-400/10",
  borderColor: "border-emerald-400/20"
},
{
  id: "consulting",
  title: "Game Design Consulting",
  icon: Gamepad2,
  color: "text-amber-400",
  bgColor: "bg-amber-400/10",
  borderColor: "border-amber-400/20"
},
{
  id: "photography",
  title: "Photography",
  icon: Camera,
  color: "text-pink-400",
  bgColor: "bg-pink-400/10",
  borderColor: "border-pink-400/20"
},
{
  id: "marketing",
  title: "Marketing & PR",
  icon: Megaphone,
  color: "text-orange-400",
  bgColor: "bg-orange-400/10",
  borderColor: "border-orange-400/20"
},
{
  id: "playtesting",
  title: "Playtesting",
  icon: Users,
  color: "text-green-400",
  bgColor: "bg-green-400/10",
  borderColor: "border-green-400/20"
},
{
  id: "manufacturing",
  title: "Manufacturing",
  icon: Briefcase,
  color: "text-red-400",
  bgColor: "bg-red-400/10",
  borderColor: "border-red-400/20"
}];


const SocialLink = ({ url, icon, brandName }) => {
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-text-muted hover:text-primary transition-colors" title={brandName}>
      {icon}
    </a>);

};

export default function Marketplace() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("all");
  const [providerTypeFilter, setProviderTypeFilter] = useState({
    freelancer: true,
    service_provider: true
  });

  useEffect(() => {
    const loadProviders = async () => {
      setLoading(true);
      try {
        // Only get users with freelancer or service_provider roles
        const allUsers = await User.list('-created_date');
        const serviceUsers = allUsers.filter((user) => {
          const roles = user.user_roles || [];
          return roles.includes('freelancer') || roles.includes('service_provider');
        });

        const serviceProviders = await ServiceProvider.list('-created_date');
        let combinedProviders = [];

        // First, add users who have ServiceProvider records (these are actual Services)
        for (const serviceProvider of serviceProviders) {
          const user = serviceUsers.find((u) => u.id === serviceProvider.user_id);
          if (user) {
            combinedProviders.push({
              ...serviceProvider,
              user: user,
              isServiceProvider: true
            });
          }
        }

        // Then add freelancers who don't have ServiceProvider records
        for (const user of serviceUsers) {
          const hasServiceProviderRecord = serviceProviders.some((sp) => sp.user_id === user.id);
          if (!hasServiceProviderRecord && user.user_roles.includes('freelancer')) {
            combinedProviders.push({
              id: `user_${user.id}`,
              user_id: user.id,
              company_name: user.display_name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
              services: user.skills || [],
              user: user,
              isServiceProvider: false
            });
          }
        }

        setProviders(combinedProviders);
      } catch (error) {
        console.error("Failed to load marketplace providers:", error);
      }
      setLoading(false);
    };
    loadProviders();
  }, []);

  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0].charAt(0) + names[names.length - 1].charAt(0);
    }
    return name.charAt(0);
  };

  // Get all unique skills from providers for dynamic filter
  const availableSkills = [...new Set(providers.flatMap((provider) =>
  provider.user?.skills || []
  ))].sort();

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch = searchQuery === "" ||
    provider.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.services?.some((service) => service.toLowerCase().includes(searchQuery.toLowerCase())) ||
    provider.user?.skills?.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
    provider.user?.display_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesServiceType = serviceTypeFilter === "all" ||
    provider.services?.some((service) => service.toLowerCase().includes(serviceTypeFilter.toLowerCase())) ||
    provider.user?.skills?.some((skill) => skill.toLowerCase().includes(serviceTypeFilter.toLowerCase()));

    const matchesSkill = skillFilter === "all" || provider.user?.skills?.includes(skillFilter);

    const matchesProviderType = (() => {
      const { freelancer, service_provider } = providerTypeFilter;
      if (!freelancer && !service_provider) return false;
      if (freelancer && service_provider) return true;

      // Use the actual provider type from our data structure, not user roles
      const isActualServiceProvider = provider.isServiceProvider; // This is based on ServiceProvider record existence
      const isActualFreelancer = !provider.isServiceProvider; // This is based on NOT having ServiceProvider record

      if (freelancer && isActualFreelancer) return true;
      if (service_provider && isActualServiceProvider) return true;

      return false;
    })();

    return matchesSearch && matchesServiceType && matchesSkill && matchesProviderType;
  });

  const handleProviderTypeChange = (type) => {
    setProviderTypeFilter((prev) => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="bg-background p-2 sm:p-4 md:p-6 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white">Creative Marketplace</h1>
          <p className="text-base sm:text-lg text-white max-w-2xl mx-auto px-4">
            Connect with talented professionals to bring your board game vision to life
          </p>
        </div>

        {/* Search & Filter */}
        <Card className="bg-surface border-border-default">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search for services, skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background border-border-default focus:border-primary text-white" />

                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                      type="checkbox"
                      checked={providerTypeFilter.freelancer}
                      onChange={() => handleProviderTypeChange('freelancer')}
                      className="w-4 h-4 text-primary bg-background border-border-default rounded focus:ring-primary focus:ring-2" />

                      <span className="text-white text-sm">Freelancers</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                      type="checkbox"
                      checked={providerTypeFilter.service_provider}
                      onChange={() => handleProviderTypeChange('service_provider')}
                      className="w-4 h-4 text-primary bg-background border-border-default rounded focus:ring-primary focus:ring-2" />

                      <span className="text-white text-sm">Services</span>
                    </label>
                </div>
                <Button
                  variant="ghost"
                  className="bg-background border border-border-default hover:bg-slate-800 text-white"
                  onClick={() => setShowFilters(!showFilters)}>

                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>

              {showFilters &&
              <div className="space-y-4 pt-4 border-t border-border-default">
                  <div className="flex flex-wrap gap-4">
                    <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                      <SelectTrigger className="w-48 bg-background border-border-default text-white">
                        <SelectValue placeholder="Service Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-surface border-border-default text-white">
                        <SelectItem value="all">All Services</SelectItem>
                        <SelectItem value="Artwork & Illustration">Art & Illustration</SelectItem>
                        <SelectItem value="Graphic Design">Graphic Design</SelectItem>
                        <SelectItem value="Writing & Editing">Writing & Editing</SelectItem>
                        <SelectItem value="Game Design Consulting">Game Design</SelectItem>
                        <SelectItem value="Photography">Photography</SelectItem>
                        <SelectItem value="Marketing & PR">Marketing</SelectItem>
                        <SelectItem value="Playtesting">Playtesting</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={skillFilter} onValueChange={setSkillFilter}>
                      <SelectTrigger className="w-48 bg-background border-border-default text-white">
                        <SelectValue placeholder="Skill" />
                      </SelectTrigger>
                      <SelectContent className="bg-surface border-border-default text-white">
                        <SelectItem value="all">All Skills</SelectItem>
                        {availableSkills.map((skill) =>
                      <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                      )}
                      </SelectContent>
                    </Select>

                    <Button
                    variant="ghost"
                    className="text-white hover:bg-slate-800"
                    onClick={() => {
                      setSearchQuery("");
                      setServiceTypeFilter("all");
                      setRatingFilter("all");
                      setSkillFilter("all");
                      setProviderTypeFilter({ freelancer: true, service_provider: true });
                    }}>

                      Clear Filters
                    </Button>
                  </div>
                </div>
              }
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">Providers</h2>
              <span className="text-sm text-text-muted">{filteredProviders.length} results</span>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {loading ?
              Array(3).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-surface rounded-xl h-48"></div>) :

              filteredProviders.map((provider) => {
                const isServiceProvider = provider.isServiceProvider;

                if (isServiceProvider) {
                  // SERVICE PROVIDER CARD
                  return (
                    <Link key={provider.id} to={createPageUrl(`Profile?id=${provider.user?.id}`)} className="block">
                        <Card className="bg-surface border-border-default hover:border-primary/50 transition-all duration-200 cursor-pointer">
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                              <div className="relative w-24 aspect-[20/23] flex-shrink-0">
                                <div className="w-full h-full p-1 bg-gradient-to-br from-primary to-secondary" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                                  <div className="w-full h-full bg-surface overflow-hidden" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                                    {provider.company_logo ?
                                  <img src={provider.company_logo} alt={provider.company_name} className="w-full h-full object-cover" /> :
                                  <div className="w-full h-full flex items-center justify-center bg-background text-primary text-xl font-bold">{getInitials(provider.company_name)}</div>
                                  }
                                  </div>
                                </div>
                              </div>

                              <div className="flex-1 min-w-0 text-center sm:text-left">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-2">
                                  <div>
                                    <div className="flex items-center gap-3 mb-1">
                                      <h3 className="text-base sm:text-lg font-bold font-serif text-white">
                                        {provider.company_name}
                                      </h3>
                                      <Badge variant="outline" className="text-xs border-amber-400/50 text-amber-400 bg-amber-400/10">Service</Badge>
                                    </div>
                                    <p className="text-sm text-slate-300">{provider.user?.city && provider.user?.country ? `${provider.user.city}, ${provider.user.country}` : 'Global'}</p>
                                  </div>
                                </div>

                                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                                  {(provider.services || []).slice(0, 4).map((item) =>
                                <Badge key={item} variant="outline" className="text-xs text-white border-border-default bg-background">{item}</Badge>
                                )}
                                  {(provider.services || []).length > 4 && <Badge variant="outline" className="text-xs text-white border-border-default bg-background">+{provider.services.length - 4}</Badge>}
                                </div>
                                
                                <p className="text-sm text-white mb-4 line-clamp-2">{provider.company_description}</p>

                                <div className="flex items-center justify-center sm:justify-start space-x-1 text-sm text-white">
                                  <SocialLink url={provider.company_website} icon={<Globe className="w-5 h-5" />} brandName="Website" />
                                  <SocialLink url={provider.twitter_url} icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>} brandName="Twitter/X" />
                                  <SocialLink url={provider.linkedin_url} icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037c-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85c3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065c0-1.138.92-2.063 2.063-2.063c1.14 0 2.064.925 2.064 2.063c0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>} brandName="LinkedIn" />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>);

                } else {
                  // FREELANCER CARD
                  return (
                    <Link key={provider.id} to={createPageUrl(`Profile?id=${provider.user?.id}`)} className="block">
                        <Card className="bg-surface border-border-default hover:border-primary/50 transition-all duration-200 cursor-pointer">
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                              <div className="relative w-24 aspect-[20/23] flex-shrink-0">
                                <div className="w-full h-full p-1 bg-gradient-to-br from-primary to-secondary" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                                  <div className="w-full h-full bg-surface overflow-hidden" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                                    {provider.user?.profile_picture ?
                                  <img src={provider.user.profile_picture} alt={provider.user.display_name} className="w-full h-full object-cover" /> :
                                  <div className="w-full h-full flex items-center justify-center bg-background text-primary text-xl font-bold">{getInitials(provider.user?.display_name)}</div>
                                  }
                                  </div>
                                </div>
                              </div>

                              <div className="flex-1 min-w-0 text-center sm:text-left">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-2">
                                  <div>
                                    <div className="flex items-center gap-3 mb-1">
                                      <h3 className="text-base sm:text-lg font-bold font-serif text-white">{provider.user?.display_name || provider.company_name}</h3>
                                      <Badge variant="outline" className="text-xs border-purple-400/50 text-purple-400 bg-purple-400/10">Freelancer</Badge>
                                    </div>
                                    <p className="text-sm text-slate-300">{provider.user?.job_title || 'Creative Professional'}</p>
                                  </div>
                                </div>

                                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                                  {(provider.user?.skills || []).slice(0, 4).map((item) =>
                                <Badge key={item} variant="outline" className="text-xs text-white border-border-default bg-background">{item}</Badge>
                                )}
                                  {(provider.user?.skills || []).length > 4 && <Badge variant="outline" className="text-xs text-white border-border-default bg-background">+{provider.user.skills.length - 4}</Badge>}
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                  <div className="flex items-center space-x-4 text-sm text-white">
                                    {(provider.user?.hourly_rate_min || provider.user?.hourly_rate_max) &&
                                  <div className="flex items-center space-x-1">
                                        <span>$</span>
                                        <span>
                                          {provider.user.hourly_rate_min && provider.user.hourly_rate_max ?
                                      `${provider.user.hourly_rate_min}-${provider.user.hourly_rate_max}/hr` :
                                      provider.user.hourly_rate_min ?
                                      `${provider.user.hourly_rate_min}+/hr` :
                                      `${provider.user.hourly_rate_max}/hr`
                                      }
                                        </span>
                                      </div>
                                  }
                                    {provider.user?.languages?.length > 0 &&
                                  <div className="flex items-center space-x-1">
                                        <Globe className="w-4 h-4" />
                                        <span>{provider.user.languages[0]}</span>
                                        {provider.user.languages.length > 1 && <span className="text-xs text-text-muted">+{provider.user.languages.length - 1}</span>}
                                      </div>
                                  }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>);

                }
              })
              }
            </div>

            {!loading && filteredProviders.length === 0 &&
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No providers found</h3>
                <p className="text-slate-300 mb-6">Try adjusting your search criteria or filters</p>
                <Button
                onClick={() => {
                  setSearchQuery("");
                  setServiceTypeFilter("all");
                  setSkillFilter("all");
                  setProviderTypeFilter({ freelancer: true, service_provider: true });
                }}
                className="btn-primary">

                  Clear All Filters
                </Button>
              </div>
            }
          </div>
          
          <div className="lg:col-span-4">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mb-4 sm:mb-6">Browse by Category</h2>
            <div className="space-y-3">
              {serviceCategories.map((category) =>
              <Card
                key={category.id}
                className="bg-surface border-border-default hover:border-primary/50 hover:bg-surface/80 transition-all duration-300 group cursor-pointer"
                onClick={() => setServiceTypeFilter(category.title)}>

                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${category.bgColor} rounded-lg flex items-center justify-center border ${category.borderColor}`}>
                        <category.icon className={`w-4 h-4 ${category.color}`} />
                      </div>
                      <h3 className="text-sm font-bold font-serif text-white group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>);

}
