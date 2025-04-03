
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

const NavEventButton = () => {
  return (
    <Button 
      variant="outline" 
      asChild
      className="ml-2"
    >
      <Link to="/admin/eventos">
        <FileText className="h-4 w-4 mr-2" />
        Gerenciar Eventos
      </Link>
    </Button>
  );
};

export default NavEventButton;
