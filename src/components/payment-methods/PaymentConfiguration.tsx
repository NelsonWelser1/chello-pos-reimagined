import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Save, AlertTriangle, Shield, CreditCard } from "lucide-react";

export function PaymentConfiguration() {
  const [config, setConfig] = useState({
    autoSettlement: true,
    fraudDetection: true,
    requireSignature: false,
    tipEnabled: true,
    defaultTipPercentage: "18",
    maxTransactionAmount: "500",
    currency: "UGX",
    merchantId: "MERCH_12345",
    terminalId: "TERM_001"
  });

  const handleSave = () => {
    console.log("Saving payment configuration:", config);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Payment Configuration</h2>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Configuration
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto Settlement</Label>
                <p className="text-sm text-gray-500">Automatically settle transactions daily</p>
              </div>
              <Switch
                checked={config.autoSettlement}
                onCheckedChange={(checked) => setConfig({...config, autoSettlement: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Tips</Label>
                <p className="text-sm text-gray-500">Allow customers to add tips</p>
              </div>
              <Switch
                checked={config.tipEnabled}
                onCheckedChange={(checked) => setConfig({...config, tipEnabled: checked})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Default Tip Percentage</Label>
              <Select 
                value={config.defaultTipPercentage}
                onValueChange={(value) => setConfig({...config, defaultTipPercentage: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15%</SelectItem>
                  <SelectItem value="18">18%</SelectItem>
                  <SelectItem value="20">20%</SelectItem>
                  <SelectItem value="22">22%</SelectItem>
                  <SelectItem value="25">25%</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <Select 
                value={config.currency}
                onValueChange={(value) => setConfig({...config, currency: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UGX">Uganda shillings (UGX)</SelectItem>
                  <SelectItem value="KSH">Kenyan Shilling (KSH)</SelectItem>
                  <SelectItem value="TSH">Tanzanian Shilling (TSH)</SelectItem>
                  <SelectItem value="RWF">Rwandan Franc (RWF)</SelectItem>
                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                  <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Fraud Detection</Label>
                <p className="text-sm text-gray-500">Enable advanced fraud protection</p>
              </div>
              <Switch
                checked={config.fraudDetection}
                onCheckedChange={(checked) => setConfig({...config, fraudDetection: checked})}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Require Signature</Label>
                <p className="text-sm text-gray-500">Require signature for transactions</p>
              </div>
              <Switch
                checked={config.requireSignature}
                onCheckedChange={(checked) => setConfig({...config, requireSignature: checked})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Max Transaction Amount (UGX)</Label>
              <Input
                type="number"
                value={config.maxTransactionAmount}
                onChange={(e) => setConfig({...config, maxTransactionAmount: e.target.value})}
                placeholder="Enter maximum amount in UGX"
              />
            </div>

            <div className="space-y-2">
              <Label>Merchant ID</Label>
              <Input
                value={config.merchantId}
                onChange={(e) => setConfig({...config, merchantId: e.target.value})}
                placeholder="Enter merchant ID"
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label>Terminal ID</Label>
              <Input
                value={config.terminalId}
                onChange={(e) => setConfig({...config, terminalId: e.target.value})}
                placeholder="Enter terminal ID"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warning Alert */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800">Configuration Changes</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Changes to payment configuration will take effect immediately. Ensure all settings are correct before saving.
                Some changes may require PCI compliance verification.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
