import { Header } from "@/components/Header";
import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <AuthForm mode="login" />
    </div>
  );
}
