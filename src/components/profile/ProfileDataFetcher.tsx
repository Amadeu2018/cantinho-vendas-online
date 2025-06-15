
import { useProfileData } from "@/hooks/useProfileData";
import { useProfileStats } from "@/hooks/useProfileStats";
import { useFavorites } from "@/hooks/useFavorites";

export const useProfileDataFetcher = () => {
  const profileData = useProfileData();
  const { favorites } = useFavorites();
  
  // Update favorites in profile data
  profileData.setFavorites(favorites);
  
  useProfileStats({
    orders: profileData.orders,
    favorites: favorites,
    setStats: (stats) => profileData.stats = stats,
    setRecentActivities: (activities) => profileData.recentActivities = activities
  });

  return {
    ...profileData,
    favorites
  };
};

export * from "@/hooks/useProfileData";
