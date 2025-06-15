
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
    fetchProfile,
    fetchAddresses,
    fetchOrders
  } = useProfileDataFetcher();

  const { loading, handleProfileUpdate, handleAddAddress } = useProfileActions({
    profile,
    setProfile,
    addresses,
    fetchAddresses
  });

  const defaultTab = searchParams.get('tab') || 'overview';

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Você precisa estar logado para ver seu perfil.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <ProfileHeader userEmail={profile.email} />
      
      <ProfileStats {...stats} />

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="tracking">Acompanhar</TabsTrigger>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="addresses">Endereços</TabsTrigger>
          <TabsTrigger value="favorites">Favoritos</TabsTrigger>
          <TabsTrigger value="orders">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity activities={recentActivities} />
            <OrderTracking userId={user.id} />
          </div>
        </TabsContent>

        <TabsContent value="tracking">
          <OrderTracking userId={user.id} />
        </TabsContent>

        <TabsContent value="profile">
          <ProfileForm
            profile={profile}
            loading={loading}
            onProfileChange={setProfile}
            onSubmit={handleProfileUpdate}
            onAddAddress={handleAddAddress}
          />
        </TabsContent>

        <TabsContent value="addresses">
          <AddressesList addresses={addresses} />
        </TabsContent>

        <TabsContent value="favorites">
          <FavoritesList favorites={favorites} />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersHistory orders={orders} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
