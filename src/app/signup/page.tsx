import { Header } from "@/components/Header";
import { AuthForm } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <AuthForm mode="signup" />
    </div>
  );
}
