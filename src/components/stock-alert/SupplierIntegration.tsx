
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Phone, Mail, MapPin, Star, TrendingUp, Clock, Package } from "lucide-react";
import { toast } from "sonner";

interface Supplier {
  id: string;
  name: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  rating: number;
  reliability: number;
  avgDeliveryTime: number;
  totalOrders: number;
  activeContracts: number;
  specialties: string[];
  lastContact: string;
  status: 'active' | 'inactive' | 'pending';
}

interface PriceQuote {
  supplierId: string;
  supplierName: string;
  ingredient: string;
  pricePerUnit: number;
  minimumOrder: number;
  deliveryTime: number;
  validUntil: string;
}

export default function SupplierIntegration() {
  const [suppliers] = useState<Supplier[]>([
    {
      id: "1",
      name: "Fresh Farm Co",
      contact: {
        phone: "+1-555-0123",
        email: "orders@freshfarm.com",
        address: "123 Farm Road, Valley City"
      },
      rating: 4.8,
      reliability: 95,
      avgDeliveryTime: 1.5,
      totalOrders: 147,
      activeContracts: 3,
      specialties: ["Vegetables", "Fruits", "Herbs"],
      lastContact: "2024-06-15",
      status: "active"
    },
    {
      id: "2",
      name: "Premium Poultry",
      contact: {
        phone: "+1-555-0456",
        email: "sales@premiumpoultry.com",
        address: "456 Poultry Lane, Farmville"
      },
      rating: 4.6,
      reliability: 92,
      avgDeliveryTime: 1.0,
      totalOrders: 89,
      activeContracts: 2,
      specialties: ["Chicken", "Turkey", "Duck"],
      lastContact: "2024-06-16",
      status: "active"
    },
    {
      id: "3",
      name: "Mediterranean Oils",
      contact: {
        phone: "+1-555-0789",
        email: "info@medoils.com",
        address: "789 Olive Grove, Coast City"
      },
      rating: 4.9,
      reliability: 98,
      avgDeliveryTime: 2.5,
      totalOrders: 234,
      activeContracts: 5,
      specialties: ["Olive Oil", "Vinegars", "Specialty Oils"],
      lastContact: "2024-06-14",
      status: "active"
    }
  ]);

  const [quotes] = useState<PriceQuote[]>([
    {
      supplierId: "1",
      supplierName: "Fresh Farm Co",
      ingredient: "Fresh Tomatoes",
      pricePerUnit: 3.25,
      minimumOrder: 20,
      deliveryTime: 1,
      validUntil: "2024-06-25"
    },
    {
      supplierId: "2",
      supplierName: "Premium Poultry",
      ingredient: "Chicken Breast",
      pricePerUnit: 8.75,
      minimumOrder: 10,
      deliveryTime: 1,
      validUntil: "2024-06-30"
    }
  ]);

  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);

  const contactSupplier = (supplier: Supplier) => {
    toast.success(`Contacting ${supplier.name}...`);
    // Here you would integrate with email/SMS service
  };

  const requestQuote = (supplierId: string, ingredient: string) => {
    toast.success("Quote request sent successfully");
    // Here you would send quote request to supplier
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Supplier Directory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {suppliers.map(supplier => (
              <div 
                key={supplier.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedSupplier === supplier.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                }`}
                onClick={() => setSelectedSupplier(supplier.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{supplier.name}</h3>
                    <Badge className={`${getStatusColor(supplier.status)} text-white`}>
                      {supplier.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{supplier.rating}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{supplier.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{supplier.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{supplier.avgDeliveryTime} days avg</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-500" />
                    <span>{supplier.reliability}% reliable</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {supplier.specialties.map(specialty => (
                    <Badge key={specialty} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      contactSupplier(supplier);
                    }}
                  >
                    Contact
                  </Button>
                  <Button 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      requestQuote(supplier.id, "General Quote");
                    }}
                  >
                    Request Quote
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Price Quotes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quotes.map((quote, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{quote.ingredient}</h3>
                  <Badge variant="outline">{quote.supplierName}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-gray-600">Price per unit</p>
                    <p className="font-medium text-lg text-green-600">
                      ${quote.pricePerUnit.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Minimum order</p>
                    <p className="font-medium">{quote.minimumOrder} units</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Delivery time</p>
                    <p className="font-medium">{quote.deliveryTime} days</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Valid until</p>
                    <p className="font-medium">
                      {new Date(quote.validUntil).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Accept Quote
                  </Button>
                  <Button size="sm" variant="outline">
                    Negotiate
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">Need a quote for a specific ingredient?</p>
              <div className="flex gap-2">
                <Input placeholder="Enter ingredient name" className="flex-1" />
                <Button>Request Quote</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
