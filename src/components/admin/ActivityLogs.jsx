import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Search, Filter, Download, Eye, Clock, User, Activity } from 'lucide-react';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    action: '',
    userId: '',
    page: 1
  });

  useEffect(() => {
    fetchActivityLogs();
  }, [filters]);

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`/admin/activity?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    if (action.includes('login') || action.includes('register')) {
      return 'bg-green-100 text-green-800';
    }
    if (action.includes('logout')) {
      return 'bg-blue-100 text-blue-800';
    }
    if (action.includes('delete') || action.includes('suspend')) {
      return 'bg-red-100 text-red-800';
    }
    if (action.includes('admin') || action.includes('update')) {
      return 'bg-purple-100 text-purple-800';
    }
    if (action.includes('create') || action.includes('add')) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const formatAction = (action) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const exportLogs = () => {
    const csvContent = [
      ['Date', 'User', 'Action', 'IP Address', 'Details'].join(','),
      ...logs.map(log => [
        new Date(log.created_date).toLocaleString(),
        log.user_name || 'System',
        log.action,
        log.ip_address || 'N/A',
        log.details || ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Activity Logs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search logs..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filters.action} onValueChange={(value) => setFilters({ ...filters, action: value, page: 1 })}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Actions</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
                <SelectItem value="register">Registration</SelectItem>
                <SelectItem value="admin">Admin Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={exportLogs}
              className="flex items-center space-x-2"
              disabled={logs.length === 0}
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: logs.length, icon: Activity, color: 'text-blue-600' },
          { 
            label: 'User Actions', 
            value: logs.filter(l => !l.action.includes('admin')).length, 
            icon: User, 
            color: 'text-green-600' 
          },
          { 
            label: 'Admin Actions', 
            value: logs.filter(l => l.action.includes('admin')).length, 
            icon: Eye, 
            color: 'text-purple-600' 
          },
          { 
            label: 'Today', 
            value: logs.filter(l => new Date(l.created_date).toDateString() === new Date().toDateString()).length, 
            icon: Clock, 
            color: 'text-orange-600' 
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activity Logs Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading activity logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No activity logs found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {new Date(log.created_date).toLocaleDateString()}
                        </div>
                        <div className="text-gray-500">
                          {new Date(log.created_date).toLocaleTimeString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                          {log.user_name ? log.user_name.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {log.user_name || 'System'}
                          </div>
                          {log.user_email && (
                            <div className="text-xs text-gray-500">{log.user_email}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getActionColor(log.action)}>
                        {formatAction(log.action)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-mono text-gray-600">
                        {log.ip_address || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {log.details ? (
                          <span title={log.details}>
                            {log.details.length > 50 ? 
                              `${log.details.substring(0, 50)}...` : 
                              log.details
                            }
                          </span>
                        ) : (
                          <span className="text-gray-400">No details</span>
                        )}
                      </div>
                      {log.target_type && (
                        <div className="text-xs text-gray-400 mt-1">
                          Target: {log.target_type} #{log.target_id}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Load More */}
      {logs.length >= 50 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            disabled={loading}
          >
            Load More Logs
          </Button>
        </div>
      )}
    </div>
  );
}
