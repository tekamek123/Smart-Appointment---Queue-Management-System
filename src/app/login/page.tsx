import { LoginForm } from "@/components/Auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left side - Login Form */}
          <div className="p-8 lg:p-12 flex items-center justify-center">
            <LoginForm />
          </div>

          {/* Right side - Image */}
          <div className="relative overflow-hidden">
            <img
              src="/Image/SASImage.png"
              alt="Smart Appointment & Queue Management System"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <p className="mt-6 text-sm text-muted-foreground text-center">
        AI-enhanced system for managing appointments and queues
      </p>
    </div>
  );
}
