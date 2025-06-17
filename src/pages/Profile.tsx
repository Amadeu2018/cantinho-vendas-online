
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import AddressesList from "@/components/profile/AddressesList";
import FavoritesList from "@/components/profile/FavoritesList";
import OrdersHistory from "@/components/profile/OrdersHistory";
import OrderTracking from "@/components/profile/OrderTracking";
import ProfileStats from "@/components/profile/ProfileStats";
import RecentActivity from "@/components/profile/RecentActivity";
import PaymentSettings from "@/components/profile/PaymentSettings";
import { useProfileDataFetcher } from "@/components/profile/ProfileDataFetcher";
import { useProfileActions } from "@/components/profile/ProfileActions";

const Profile = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  
  const {
    profile,
    setProfile,
    addresses,
    setAddresses,
    favorites,
    orders,
    stats,
    recentActivities,
    loading,
    fetchProfile,
    fetchAddresses,
    fetchOrders
  } = useProfileDataFetcher();

  const { loading: actionsLoading, handleProfileUpdate, handleAddAddress } = useProfileActions({
    profile,
    setProfile,
    addresses,
    fetchAddresses
  });

  const defaultTab = searchParams.get('tab') || 'overview';

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          <p className="text-gray-600">Você precisa estar logado para ver seu perfil.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-2 border-cantinho-terracotta border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 md:py-8 space-y-4 md:space-y-6 max-w-7xl">
        <ProfileHeader userEmail={profile.email} />
        
        <div className="px-2 sm:px-0">
          <ProfileStats {...stats} />
        </div>

        <Tabs defaultValue={defaultTab} className="space-y-4 md:space-y-6">
          {/* Mobile-first tabs layout */}
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-4 sm:grid-cols-7 min-w-max sm:min-w-0 h-auto p-1">
              <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 py-2 sm:px-3">
                <span className="sm:hidden">Início</span>
                <span className="hidden sm:inline">Visão Geral</span>
              </TabsTrigger>
              <TabsTrigger value="tracking" className="text-xs sm:text-sm px-2 py-2 sm:px-3">
                <span className="sm:hidden">Track</span>
                <span className="hidden sm:inline">Acompanhar</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="text-xs sm:text-sm px-2 py-2 sm:px-3">
                Perfil
              </TabsTrigger>
              <TabsTrigger value="addresses" className="text-xs sm:text-sm px-2 py-2 sm:px-3">
                <span className="sm:hidden">End.</span>
                <span className="hidden sm:inline">Endereços</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="text-xs sm:text-sm px-2 py-2 sm:px-3 hidden sm:flex">
                Favoritos
              </TabsTrigger>
              <TabsTrigger value="orders" className="text-xs sm:text-sm px-2 py-2 sm:px-3 hidden sm:flex">
                Histórico
              </TabsTrigger>
              <TabsTrigger value="payments" className="text-xs sm:text-sm px-2 py-2 sm:px-3 hidden sm:flex">
                Pagamentos
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Mobile tabs for hidden items */}
          <div className="sm:hidden">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1">
              <TabsTrigger value="favorites" className="text-xs px-2 py-2">
                Favoritos
              </TabsTrigger>
              <TabsTrigger value="orders" className="text-xs px-2 py-2">
                Histórico
              </TabsTrigger>
              <TabsTrigger value="payments" className="text-xs px-2 py-2">
                Pagamentos
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="px-2 sm:px-0">
            <TabsContent value="overview" className="space-y-4 md:space-y-6 mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <RecentActivity activities={recentActivities} />
                <OrderTracking orders={orders} />
              </div>
            </TabsContent>

            <TabsContent value="tracking" className="mt-4">
              <OrderTracking orders={orders} />
            </TabsContent>

            <TabsContent value="profile" className="mt-4">
              <ProfileForm
                profile={profile}
                loading={actionsLoading}
                onProfileChange={setProfile}
                onSubmit={handleProfileUpdate}
                onAddAddress={handleAddAddress}
              />
            </TabsContent>

            <TabsContent value="addresses" className="mt-4">
              <AddressesList addresses={addresses} />
            </TabsContent>

            <TabsContent value="favorites" className="mt-4">
              <FavoritesList favorites={favorites} />
            </TabsContent>

            <TabsContent value="orders" className="mt-4">
              <OrdersHistory orders={orders} />
            </TabsContent>

            <TabsContent value="payments" className="mt-4">
              <PaymentSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
