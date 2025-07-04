import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NotificationCenter from "@/components/notifications/NotificationCenter";

const NotificationsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-cantinho-navy text-center">
            Central de Notificações
          </h1>
          <NotificationCenter />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotificationsPage;