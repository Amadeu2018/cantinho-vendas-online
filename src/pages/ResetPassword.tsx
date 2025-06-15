
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PasswordResetForm from "@/components/auth/PasswordResetForm";

const ResetPassword = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-cantinho-navy text-center">
            Recuperar Senha
          </h1>
          <PasswordResetForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
