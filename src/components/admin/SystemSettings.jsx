import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Settings, Save, RotateCcw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

export default function SystemSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/admin/settings/${key}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value })
      });

      if (response.ok) {
        // Update local state
        setSettings(prev => ({
          ...prev,
          [getCategoryFromKey(key)]: prev[getCategoryFromKey(key)]?.map(setting =>
            setting.setting_key === key ? { ...setting, setting_value: value } : setting
          )
        }));
        setMessage({ type: 'success', text: 'Setting updated successfully' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update setting' });
      }
    } catch (error) {
      console.error('Failed to update setting:', error);
      setMessage({ type: 'error', text: 'Failed to update setting' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const getCategoryFromKey = (key) => {
    // Find which category contains this setting key
    for (const [category, categorySettings] of Object.entries(settings)) {
      if (categorySettings?.find(s => s.setting_key === key)) {
        return category;
      }
    }
    return 'general';
  };

  const renderSettingField = (setting) => {
    const { setting_key, setting_value, setting_type, description } = setting;

    switch (setting_type) {
      case 'boolean':
        return (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">{setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
            <Switch
              checked={setting_value === 'true'}
              onCheckedChange={(checked) => updateSetting(setting_key, checked.toString())}
              disabled={saving}
            />
          </div>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">{setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
            <Input
              type="number"
              value={setting_value}
              onChange={(e) => updateSetting(setting_key, e.target.value)}
              disabled={saving}
              className="max-w-xs"
            />
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        );

      case 'json':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">{setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
            <Textarea
              value={setting_value}
              onChange={(e) => updateSetting(setting_key, e.target.value)}
              disabled={saving}
              rows={4}
              placeholder="Enter JSON configuration..."
            />
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        );

      default: // string
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">{setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
            <Input
              value={setting_value}
              onChange={(e) => updateSetting(setting_key, e.target.value)}
              disabled={saving}
            />
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {Object.entries(settings).map(([category, categorySettings]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 capitalize">
              <Settings className="h-5 w-5" />
              <span>{category} Settings</span>
              <Badge variant="outline">{categorySettings?.length || 0} settings</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {categorySettings?.map((setting, index) => (
              <div key={setting.setting_key}>
                {renderSettingField(setting)}
                {index < categorySettings.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>System Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Environment:</strong> {process.env.NODE_ENV || 'development'}
            </div>
            <div>
              <strong>Last Updated:</strong> {new Date().toLocaleString()}
            </div>
            <div>
              <strong>Database:</strong> MySQL (cPanel)
            </div>
            <div>
              <strong>Server:</strong> Node.js + Express
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              onClick={fetchSettings}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Refresh Settings</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => updateSetting('maintenance_mode', 'false')}
              disabled={saving}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Disable Maintenance Mode</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
