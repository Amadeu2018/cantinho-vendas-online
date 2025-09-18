import NotificationCenter from "@/components/notifications/NotificationCenter";

const Notifications = () => {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-cantinho-navy mb-2">
            Central de Notificações
          </h1>
          <p className="text-gray-600">
            Monitore todas as notificações do sistema em tempo real.
          </p>
        </div>
        
        <NotificationCenter />
      </div>
    </div>
  );
};

export default Notifications;