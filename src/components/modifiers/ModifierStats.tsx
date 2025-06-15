
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Eye, Star, Archive, DollarSign } from "lucide-react";
import type { Modifier } from '@/hooks/useModifiers';

interface ModifierStatsProps {
  modifiers: Modifier[];
}

export default function ModifierStats({ modifiers }: ModifierStatsProps) {
  const activeModifiers = modifiers.filter(modifier => modifier.isActive);
  const paidModifiers = modifiers.filter(modifier => (modifier.price ?? 0) > 0);
  const requiredModifiers = modifiers.filter(modifier => modifier.isRequired);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Modifiers</p>
              <p className="text-3xl font-black">{modifiers.length}</p>
            </div>
            <Settings className="w-12 h-12 text-purple-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Active Modifiers</p>
              <p className="text-3xl font-black">{activeModifiers.length}</p>
            </div>
            <Eye className="w-12 h-12 text-green-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Paid Modifiers</p>
              <p className="text-3xl font-black">{paidModifiers.length}</p>
            </div>
            <DollarSign className="w-12 h-12 text-blue-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Required</p>
              <p className="text-3xl font-black">{requiredModifiers.length}</p>
            </div>
            <Star className="w-12 h-12 text-orange-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100">Avg Price</p>
              <p className="text-3xl font-black">
                ${paidModifiers.length > 0 ? (paidModifiers.reduce((sum, modifier) => sum + (modifier.price ?? 0), 0) / paidModifiers.length).toFixed(2) : '0.00'}
              </p>
            </div>
            <Archive className="w-12 h-12 text-indigo-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
