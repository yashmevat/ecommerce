"use client";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SigninPage() {
  const router = useRouter();

  // Handle Credentials Login
  async function handleSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // manual redirect
    });

    if (result?.error) {
      alert(result.error);
    } else {
      const session = await getSession();
      if (session?.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/customer/dashboard");
      }
    }
  }

  // Handle Google Login
  async function handleGoogleLogin() {
    await signIn("google", { callbackUrl: "/customer/dashboard" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Sign In
        </h1>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            required
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold transition"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-400 text-sm">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg font-semibold transition"
        >
          Sign In with Google
        </button>

        <p className="text-sm text-gray-500 text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="text-purple-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
