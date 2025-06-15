
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Clock, CheckCircle, Star } from "lucide-react";

interface ProfileStatsProps {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  favoriteCount: number;
}

const ProfileStats = ({ 
  totalOrders, 
  pendingOrders, 
  completedOrders, 
  favoriteCount 
}: ProfileStatsProps) => {
  const stats = [
    {
      title: "Total de Pedidos",
      value: totalOrders,
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Em Andamento",
      value: pendingOrders,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Concluídos",
      value: completedOrders,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Favoritos",
      value: favoriteCount,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProfileStats;
