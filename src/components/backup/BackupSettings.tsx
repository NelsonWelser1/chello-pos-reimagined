
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Save, TestTube, Cloud, HardDrive, Mail } from "lucide-react";
import { useState } from "react";

interface BackupSettings {
  retentionDays: number;
  maxBackupSize: number;
  compressionLevel: "none" | "low" | "medium" | "high";
  encryptionEnabled: boolean;
  cloudStorageEnabled: boolean;
  emailNotifications: boolean;
  notificationEmail: string;
  excludedFolders: string;
  cloudProvider: "aws" | "google" | "azure" | "dropbox";
  autoCleanup: boolean;
}

export function BackupSettings() {
  const [settings, setSettings] = useState<BackupSettings>({
    retentionDays: 30,
    maxBackupSize: 10,
    compressionLevel: "medium",
    encryptionEnabled: true,
    cloudStorageEnabled: true,
    emailNotifications: true,
    notificationEmail: "admin@example.com",
    excludedFolders: "/tmp, /cache, /logs",
    cloudProvider: "aws",
    autoCleanup: true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    console.log("Saving backup settings:", settings);
    setTimeout(() => {
      setIsSaving(false);
      console.log("Settings saved successfully");
    }, 1500);
  };

  const handleTestBackup = () => {
    setIsTesting(true);
    console.log("Testing backup configuration...");
    setTimeout(() => {
      setIsTesting(false);
      console.log("Backup test completed successfully");
    }, 3000);
  };

  const updateSetting = (key: keyof BackupSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="retention">Retention Period (Days)</Label>
              <Input
                id="retention"
                type="number"
                value={settings.retentionDays}
                onChange={(e) => updateSetting("retentionDays", parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxSize">Max Backup Size (GB)</Label>
              <Input
                id="maxSize"
                type="number"
                value={settings.maxBackupSize}
                onChange={(e) => updateSetting("maxBackupSize", parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Compression Level</Label>
            <Select 
              value={settings.compressionLevel} 
              onValueChange={(value) => updateSetting("compressionLevel", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Encryption</Label>
              <p className="text-sm text-gray-500">Encrypt backup files for security</p>
            </div>
            <Switch
              checked={settings.encryptionEnabled}
              onCheckedChange={(checked) => updateSetting("encryptionEnabled", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Cleanup</Label>
              <p className="text-sm text-gray-500">Automatically delete old backups</p>
            </div>
            <Switch
              checked={settings.autoCleanup}
              onCheckedChange={(checked) => updateSetting("autoCleanup", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Cloud Storage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Cloud Storage</Label>
              <p className="text-sm text-gray-500">Backup to cloud storage provider</p>
            </div>
            <Switch
              checked={settings.cloudStorageEnabled}
              onCheckedChange={(checked) => updateSetting("cloudStorageEnabled", checked)}
            />
          </div>

          {settings.cloudStorageEnabled && (
            <div className="space-y-2">
              <Label>Cloud Provider</Label>
              <Select 
                value={settings.cloudProvider} 
                onValueChange={(value) => updateSetting("cloudProvider", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aws">Amazon S3</SelectItem>
                  <SelectItem value="google">Google Cloud</SelectItem>
                  <SelectItem value="azure">Microsoft Azure</SelectItem>
                  <SelectItem value="dropbox">Dropbox</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-500">Get notified about backup status</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
            />
          </div>

          {settings.emailNotifications && (
            <div className="space-y-2">
              <Label htmlFor="email">Notification Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.notificationEmail}
                onChange={(e) => updateSetting("notificationEmail", e.target.value)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Advanced Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="excluded">Excluded Folders</Label>
            <Textarea
              id="excluded"
              value={settings.excludedFolders}
              onChange={(e) => updateSetting("excludedFolders", e.target.value)}
              placeholder="Enter folders to exclude, separated by commas"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={handleSaveSettings} disabled={isSaving} className="flex-1">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
        <Button 
          variant="outline" 
          onClick={handleTestBackup} 
          disabled={isTesting}
          className="flex-1"
        >
          <TestTube className="w-4 h-4 mr-2" />
          {isTesting ? "Testing..." : "Test Configuration"}
        </Button>
      </div>
    </div>
  );
}
