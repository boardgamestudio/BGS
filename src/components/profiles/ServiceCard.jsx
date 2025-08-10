import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, 
  Star, 
  Users,
  Globe,
  Phone,
  Mail,
  Calendar,
  Award
} from "lucide-react";

export default function ServiceCard({ service }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-stone-200 hover:bg-white hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-16 h-16 bg-stone-100 rounded-lg flex items-center justify-center overflow-hidden">
            {service.company_logo ? (
              <img 
                src={service.company_logo} 
                alt="Company Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-amber-200 rounded-lg"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-stone-900 truncate">
              {service.company_name || 'Service Provider'}
            </h3>
            <div className="flex items-center space-x-3 mt-1">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-amber-400 fill-current" />
                <span className="text-sm font-semibold">
                  {service.overall_rating?.toFixed(1) || 'New'}
                </span>
                <span className="text-sm text-stone-500">
                  ({service.review_count || 0})
                </span>
              </div>
              {service.year_founded && (
                <div className="flex items-center space-x-1 text-sm text-stone-500">
                  <Calendar className="w-4 h-4" />
                  <span>Est. {service.year_founded}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {service.services?.slice(0, 3).map((serviceType) => (
              <Badge key={serviceType} className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                {serviceType}
              </Badge>
            ))}
            {service.services?.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{service.services.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-stone-600 mb-4 line-clamp-3">
          {service.company_description}
        </p>

        {/* Company Info */}
        <div className="flex items-center justify-between text-sm text-stone-500 mb-4">
          <div className="flex items-center space-x-4">
            {service.employee_count && (
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{service.employee_count} employees</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{service.city}, {service.country}</span>
            </div>
          </div>
        </div>

        {/* Specializations */}
        {service.game_type_specialization && service.game_type_specialization.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-stone-500 mb-2">Specializes in:</p>
            <div className="flex flex-wrap gap-1">
              {service.game_type_specialization.slice(0, 3).map((type) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {type}
                </Badge>
              ))}
              {service.game_type_specialization.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{service.game_type_specialization.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Contact Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {service.company_website && (
              <a
                href={service.company_website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-stone-600 transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
            <a
              href={`mailto:${service.contact_email}`}
              className="text-stone-400 hover:text-stone-600 transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
            {service.contact_number && (
              <a
                href={`tel:${service.contact_number}`}
                className="text-stone-400 hover:text-stone-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
          </div>

          <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}