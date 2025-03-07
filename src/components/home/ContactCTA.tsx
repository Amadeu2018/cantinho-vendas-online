
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ContactCTA = () => {
  return (
    <section className="py-20 bg-cantinho-olive">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Pronto para Experimentar?</h2>
        <p className="text-white/90 max-w-2xl mx-auto mb-8">
          Faça já o seu pedido ou contacte-nos para obter mais informações sobre os nossos serviços de catering para eventos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-white text-cantinho-olive hover:bg-white/90">
            <Link to="/menu">Ver Menu</Link>
          </Button>
          <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
            <Link to="/contacto">Contacte-nos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
