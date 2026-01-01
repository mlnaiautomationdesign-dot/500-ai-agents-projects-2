import LoginForm from "@/components/Auth/LoginForm";
import { AuthProvider } from "@/lib/useAuth";

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
