
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  ShoppingCart, 
  ChefHat, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Users,
  Package,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Zap
} from "lucide-react";

interface SystemConnection {
  id: string;
  name: string;
  type: 'pos' | 'kitchen' | 'accounting' | 'crm' | 'inventory';
  status: 'connected' | 'disconnected' | 'syncing';
  lastSync: string;
  dataPoints: number;
  healthScore: number;
}

interface DataFlow {
  from: string;
  to: string;
  type: string;
  volume: number;
  status: 'active' | 'error' | 'idle';
}

export default function SystemIntegrationHub() {
  const [connections] = useState<SystemConnection[]>([
    {
      id: "pos",
      name: "Point of Sale System",
      type: "pos",
      status: "connected",
      lastSync: "2024-06-16T10:30:00Z",
      dataPoints: 15420,
      healthScore: 98
    },
    {
      id: "kitchen",
      name: "Kitchen Display System",
      type: "kitchen",
      status: "connected",
      lastSync: "2024-06-16T10:28:00Z",
      dataPoints: 8760,
      healthScore: 95
    },
    {
      id: "inventory",
      name: "Inventory Management",
      type: "inventory",
      status: "syncing",
      lastSync: "2024-06-16T10:25:00Z",
      dataPoints: 3280,
      healthScore: 92
    },
    {
      id: "accounting",
      name: "Accounting System",
      type: "accounting",
      status: "connected",
      lastSync: "2024-06-16T09:45:00Z",
      dataPoints: 5640,
      healthScore: 89
    }
  ]);

  const [dataFlows] = useState<DataFlow[]>([
    { from: "POS", to: "Stock Alert", type: "Sales Data", volume: 1250, status: "active" },
    { from: "Kitchen", to: "Stock Alert", type: "Usage Data", volume: 890, status: "active" },
    { from: "Stock Alert", to: "Inventory", type: "Reorder Triggers", volume: 45, status: "active" },
    { from: "Stock Alert", to: "Accounting", type: "Cost Updates", volume: 230, status: "active" }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'syncing': return <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />;
      case 'disconnected': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pos': return <ShoppingCart className="w-5 h-5" />;
      case 'kitchen': return <ChefHat className="w-5 h-5" />;
      case 'inventory': return <Package className="w-5 h-5" />;
      case 'accounting': return <DollarSign className="w-5 h-5" />;
      case 'crm': return <Users className="w-5 h-5" />;
      default: return <Database className="w-5 h-5" />;
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 95) return "text-green-600";
    if (score >= 85) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Connected Systems</p>
                <p className="text-2xl font-bold">
                  {connections.filter(c => c.status === 'connected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Data Points/Day</p>
                <p className="text-2xl font-bold">
                  {connections.reduce((sum, c) => sum + c.dataPoints, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Active Flows</p>
                <p className="text-2xl font-bold">
                  {dataFlows.filter(f => f.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-500" />
              <div>
                <p className="text-sm text-gray-600">System Health</p>
                <p className="text-2xl font-bold">
                  {Math.round(connections.reduce((sum, c) => sum + c.healthScore, 0) / connections.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="connections" className="space-y-4">
        <TabsList>
          <TabsTrigger value="connections">System Connections</TabsTrigger>
          <TabsTrigger value="dataflows">Data Flows</TabsTrigger>
          <TabsTrigger value="analytics">Integration Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="connections">
          <Card>
            <CardHeader>
              <CardTitle>Connected Systems</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {connections.map(connection => (
                  <div key={connection.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(connection.type)}
                        <div>
                          <h3 className="font-semibold">{connection.name}</h3>
                          <p className="text-sm text-gray-600">
                            Last sync: {new Date(connection.lastSync).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Health Score</p>
                          <p className={`font-bold ${getHealthColor(connection.healthScore)}`}>
                            {connection.healthScore}%
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(connection.status)}
                          <Badge variant={connection.status === 'connected' ? 'default' : 'secondary'}>
                            {connection.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Data Points</p>
                        <p className="font-medium">{connection.dataPoints.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Type</p>
                        <p className="font-medium capitalize">{connection.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status</p>
                        <Progress value={connection.healthScore} className="h-2 mt-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dataflows">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Data Flows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataFlows.map((flow, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{flow.from}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{flow.to}</span>
                      </div>
                      <Badge variant="outline">{flow.type}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Volume (24h)</p>
                        <p className="font-medium">{flow.volume.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${
                          flow.status === 'active' ? 'bg-green-500 animate-pulse' :
                          flow.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                        }`}></div>
                        <span className="text-sm capitalize">{flow.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Integration Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Stock Accuracy Improvement</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Before Integration</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                      <div className="flex justify-between">
                        <span>After Integration</span>
                        <span className="text-green-600 font-semibold">96%</span>
                      </div>
                      <Progress value={96} className="h-2" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Response Time Reduction</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Manual Process</span>
                        <span>45 minutes</span>
                      </div>
                      <Progress value={90} className="h-2" />
                      <div className="flex justify-between">
                        <span>Automated Process</span>
                        <span className="text-green-600 font-semibold">2 minutes</span>
                      </div>
                      <Progress value={4} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Cost Savings Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">$2,450</p>
                    <p className="text-sm text-gray-600">Monthly Savings</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">15 hours</p>
                    <p className="text-sm text-gray-600">Time Saved Weekly</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">23%</p>
                    <p className="text-sm text-gray-600">Efficiency Gain</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
