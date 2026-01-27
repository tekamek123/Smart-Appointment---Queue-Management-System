import { AuthButton } from "@/components/Auth/AuthButton";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center">
          Smart Appointment & Queue Management System
        </h1>
        <div className="absolute top-4 right-4">
          <AuthButton />
        </div>
      </div>
      <div className="text-center">
        <p className="text-xl mt-8">
          AI-enhanced system for managing appointments and queues
        </p>
      </div>
    </main>
  );
}
