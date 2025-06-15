
import { useProfileData } from "@/hooks/useProfileData";
import { useProfileStats } from "@/hooks/useProfileStats";
import { useFavorites } from "@/hooks/useFavorites";
import { useEffect } from "react";

export const useProfileDataFetcher = () => {
  const profileData = useProfileData();
  const { favorites } = useFavorites();
  
  // Use useEffect to update favorites instead of during render
  useEffect(() => {
    if (favorites.length > 0) {
      profileData.setFavorites(favorites);
    }
  }, [favorites, profileData.setFavorites]);
  
  useProfileStats({
    orders: profileData.orders,
    favorites: favorites,
    setStats: profileData.setStats,
    setRecentActivities: profileData.setRecentActivities
  });

  return {
    ...profileData,
    favorites
  };
};

export * from "@/hooks/useProfileData";
