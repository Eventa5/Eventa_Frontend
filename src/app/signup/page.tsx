import SignUpForm from "@/components/layout/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-4">
      <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/logo.png"
            alt="Eventa Logo"
            className="w-[120px] mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-2.5">註冊帳號</h1>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
