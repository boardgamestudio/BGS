import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Users, Activity, FileText, Calendar, TrendingUp, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard statistics</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers || 0,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      subtitle: 'Last 30 days'
    },
    {
      title: 'Projects',
      value: stats.content?.projects || 0,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Events',
      value: stats.content?.events || 0,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.subtitle && (
                  <p className="text-xs text-muted-foreground">
                    {stat.subtitle}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Membership Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Membership Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.membershipDistribution?.map((tier, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={tier.membership_tier === 'pro' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {tier.membership_tier}
                    </Badge>
                  </div>
                  <span className="font-medium">{tier.count} users</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivity?.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{activity.user_name || 'System'}</span>
                    <span className="text-gray-500 ml-2">{activity.action.replace(/_/g, ' ')}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(activity.created_date).toLocaleDateString()}
                  </span>
                </div>
              )) || (
                <p className="text-gray-500 text-sm">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                +{stats.newUsersThisMonth || 0}
              </div>
              <p className="text-sm text-gray-500">New Users This Month</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.content?.jobs || 0}
              </div>
              <p className="text-sm text-gray-500">Total Job Posts</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-gray-500">User Engagement Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
