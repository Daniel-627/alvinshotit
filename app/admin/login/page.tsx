import Image from "next/image";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <Image src="/logo-full.png" alt="Alvin Shot It" width={980} height={320} className="mx-auto h-12 w-auto" />
        <p className="eyebrow mt-8 text-center">Admin</p>
        <LoginForm />
      </div>
    </div>
  );
}
