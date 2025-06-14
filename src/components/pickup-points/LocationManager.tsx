
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Settings, Save, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface LocationSettings {
  id: string;
  name: string;
  address: string;
  capacity: number;
  openTime: string;
  closeTime: string;
  autoNotifications: boolean;
  maxWaitTime: number;
  allowWalkIns: boolean;
  requiresStaffConfirmation: boolean;
}

export function LocationManager() {
  const [locations, setLocations] = useState<LocationSettings[]>([
    {
      id: "1",
      name: "Downtown Hub",
      address: "123 Main St, Downtown",
      capacity: 50,
      openTime: "08:00",
      closeTime: "22:00",
      autoNotifications: true,
      maxWaitTime: 15,
      allowWalkIns: true,
      requiresStaffConfirmation: false
    },
    {
      id: "2",
      name: "Mall Location",
      address: "456 Shopping Center Dr",
      capacity: 30,
      openTime: "10:00",
      closeTime: "21:00",
      autoNotifications: true,
      maxWaitTime: 20,
      allowWalkIns: false,
      requiresStaffConfirmation: true
    }
  ]);

  const [selectedLocation, setSelectedLocation] = useState<LocationSettings | null>(locations[0]);

  const handleSaveLocation = () => {
    if (selectedLocation) {
      setLocations(prev => 
        prev.map(loc => loc.id === selectedLocation.id ? selectedLocation : loc)
      );
      console.log("Location saved:", selectedLocation);
    }
  };

  const handleAddLocation = () => {
    const newLocation: LocationSettings = {
      id: Date.now().toString(),
      name: "New Location",
      address: "",
      capacity: 25,
      openTime: "09:00",
      closeTime: "18:00",
      autoNotifications: true,
      maxWaitTime: 15,
      allowWalkIns: true,
      requiresStaffConfirmation: false
    };
    setLocations(prev => [...prev, newLocation]);
    setSelectedLocation(newLocation);
  };

  const handleDeleteLocation = (id: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== id));
    if (selectedLocation?.id === id) {
      setSelectedLocation(locations[0] || null);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Location List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Locations
            </CardTitle>
            <Button size="sm" onClick={handleAddLocation}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {locations.map((location) => (
            <div
              key={location.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedLocation?.id === location.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedLocation(location)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{location.name}</h4>
                  <p className="text-sm text-gray-500">{location.address}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {location.capacity}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {location.openTime}-{location.closeTime}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteLocation(location.id);
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Location Settings */}
      <div className="lg:col-span-2">
        {selectedLocation ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Location Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Location Name</Label>
                  <Input
                    id="name"
                    value={selectedLocation.name}
                    onChange={(e) => setSelectedLocation({
                      ...selectedLocation,
                      name: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={selectedLocation.capacity}
                    onChange={(e) => setSelectedLocation({
                      ...selectedLocation,
                      capacity: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={selectedLocation.address}
                  onChange={(e) => setSelectedLocation({
                    ...selectedLocation,
                    address: e.target.value
                  })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openTime">Opening Time</Label>
                  <Input
                    id="openTime"
                    type="time"
                    value={selectedLocation.openTime}
                    onChange={(e) => setSelectedLocation({
                      ...selectedLocation,
                      openTime: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closeTime">Closing Time</Label>
                  <Input
                    id="closeTime"
                    type="time"
                    value={selectedLocation.closeTime}
                    onChange={(e) => setSelectedLocation({
                      ...selectedLocation,
                      closeTime: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxWaitTime">Maximum Wait Time (minutes)</Label>
                <Input
                  id="maxWaitTime"
                  type="number"
                  value={selectedLocation.maxWaitTime}
                  onChange={(e) => setSelectedLocation({
                    ...selectedLocation,
                    maxWaitTime: parseInt(e.target.value) || 0
                  })}
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Location Settings</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Notifications</Label>
                    <p className="text-sm text-gray-500">Automatically notify customers when orders are ready</p>
                  </div>
                  <Switch
                    checked={selectedLocation.autoNotifications}
                    onCheckedChange={(checked) => setSelectedLocation({
                      ...selectedLocation,
                      autoNotifications: checked as boolean
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Walk-ins</Label>
                    <p className="text-sm text-gray-500">Accept orders without advance booking</p>
                  </div>
                  <Switch
                    checked={selectedLocation.allowWalkIns}
                    onCheckedChange={(checked) => setSelectedLocation({
                      ...selectedLocation,
                      allowWalkIns: checked as boolean
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Staff Confirmation Required</Label>
                    <p className="text-sm text-gray-500">Require staff to confirm order completion</p>
                  </div>
                  <Switch
                    checked={selectedLocation.requiresStaffConfirmation}
                    onCheckedChange={(checked) => setSelectedLocation({
                      ...selectedLocation,
                      requiresStaffConfirmation: checked as boolean
                    })}
                  />
                </div>
              </div>

              <Button onClick={handleSaveLocation} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <p className="text-gray-500">Select a location to edit settings</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
