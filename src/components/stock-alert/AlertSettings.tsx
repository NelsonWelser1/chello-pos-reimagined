
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Settings, Bell, Smartphone, Mail, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AlertSettingsProps {
  settings: {
    lowStockThreshold: number;
    expiryWarningDays: number;
    autoReorderEnabled: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
  onSettingsChange: (settings: any) => void;
}

export default function AlertSettings({ settings, onSettingsChange }: AlertSettingsProps) {
  const updateSetting = (key: string, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving settings:', settings);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Settings className="w-8 h-8" />
            Alert Settings & Configuration
          </CardTitle>
          <p className="text-blue-100">
            Customize your stock alert preferences and notification settings
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Alert Thresholds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Alert Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Low Stock Alert Threshold (days)</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                value={settings.lowStockThreshold}
                onChange={(e) => updateSetting('lowStockThreshold', parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-gray-600">
                Alert when stock will last fewer than this many days
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryWarningDays">Expiry Warning (days before)</Label>
              <Input
                id="expiryWarningDays"
                type="number"
                value={settings.expiryWarningDays}
                onChange={(e) => updateSetting('expiryWarningDays', parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-gray-600">
                Warn about expiring items this many days in advance
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-Reorder Critical Items</Label>
                  <p className="text-sm text-gray-600">
                    Automatically place orders for critical stock items
                  </p>
                </div>
                <Switch
                  checked={settings.autoReorderEnabled}
                  onCheckedChange={(checked) => updateSetting('autoReorderEnabled', checked)}
                />
              </div>

              {settings.autoReorderEnabled && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Auto-Reorder Configuration</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Reorder Trigger</Label>
                      <Select defaultValue="critical">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">When stock becomes critical</SelectItem>
                          <SelectItem value="minimum">When stock hits minimum level</SelectItem>
                          <SelectItem value="prediction">Based on AI predictions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Reorder Quantity</Label>
                      <Select defaultValue="optimal">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimum">Minimum required</SelectItem>
                          <SelectItem value="optimal">AI-optimized quantity</SelectItem>
                          <SelectItem value="maximum">Fill to maximum capacity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Notifications
                </Label>
                <p className="text-sm text-gray-600">
                  Receive alerts via email
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
              />
            </div>

            {settings.emailNotifications && (
              <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <Label>Email Frequency</Label>
                  <Select defaultValue="immediate">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate alerts</SelectItem>
                      <SelectItem value="daily">Daily digest</SelectItem>
                      <SelectItem value="weekly">Weekly summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Alert Types</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="email-critical" defaultChecked className="rounded" />
                      <Label htmlFor="email-critical" className="text-sm">Critical stock alerts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="email-expiry" defaultChecked className="rounded" />
                      <Label htmlFor="email-expiry" className="text-sm">Expiry warnings</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="email-predictions" className="rounded" />
                      <Label htmlFor="email-predictions" className="text-sm">Weekly predictions</Label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  SMS Notifications
                </Label>
                <p className="text-sm text-gray-600">
                  Receive critical alerts via SMS
                </p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
              />
            </div>

            {settings.smsNotifications && (
              <div className="space-y-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <Label>Phone Number</Label>
                  <Input placeholder="+1 (555) 123-4567" className="mt-1" />
                </div>
                <div>
                  <Label>SMS Alert Types</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="sms-critical" defaultChecked className="rounded" />
                      <Label htmlFor="sms-critical" className="text-sm">Critical stockouts only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="sms-expired" className="rounded" />
                      <Label htmlFor="sms-expired" className="text-sm">Expired items</Label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Prediction Algorithm</h4>
              <Select defaultValue="ai-enhanced">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple moving average</SelectItem>
                  <SelectItem value="exponential">Exponential smoothing</SelectItem>
                  <SelectItem value="ai-enhanced">AI-enhanced predictions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Safety Stock Calculation</h4>
              <Select defaultValue="dynamic">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed percentage</SelectItem>
                  <SelectItem value="lead-time">Lead time based</SelectItem>
                  <SelectItem value="dynamic">Dynamic calculation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Alert Escalation</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="escalate-manager" defaultChecked className="rounded" />
                  <Label htmlFor="escalate-manager" className="text-sm">Notify manager for critical alerts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="escalate-supplier" className="rounded" />
                  <Label htmlFor="escalate-supplier" className="text-sm">Auto-notify suppliers</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Integration Settings</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="sync-pos" className="rounded" />
                  <Label htmlFor="sync-pos" className="text-sm">Sync with POS system</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="supplier-portal" className="rounded" />
                  <Label htmlFor="supplier-portal" className="text-sm">Connect to supplier portals</Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 px-8">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
