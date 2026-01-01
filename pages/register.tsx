import RegisterForm from "@/components/Auth/RegisterForm";
import { AuthProvider } from "@/lib/useAuth";

export default function RegisterPage() {
  return (
    <AuthProvider>
      <RegisterForm />
    </AuthProvider>
  );
}
