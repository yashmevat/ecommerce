"use client";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SigninPage() {
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
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

  async function handleGoogleLogin() {
    await signIn("google", { callbackUrl: "/customer/dashboard" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-50 to-blue-50 p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md flex flex-col gap-6
                      sm:p-10 sm:gap-8
                      md:max-w-lg">
        <h1 className="text-3xl font-bold text-gray-800 text-center sm:text-4xl">
          Welcome Back
        </h1>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition placeholder-gray-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition placeholder-gray-400"
            required
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-400 text-sm">or continue with</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          className="bg-white hover:bg-white-600 text-black p-4 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 533.5 544.3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M533.5 278.4c0-17.5-1.5-34.3-4.3-50.7H272.1v95.9h146.9c-6.4 34.8-25.6 64.3-54.5 84.1v69h88.2c51.7-47.6 81.8-118 81.8-198.3z"
              fill="#4285f4"
            />
            <path
              d="M272.1 544.3c73.8 0 135.6-24.3 180.8-65.9l-88.2-69c-24.5 16.4-55.7 26-92.6 26-71 0-131.1-47.9-152.7-112.3H28.6v70.7c45.2 89 137.1 150.5 243.5 150.5z"
              fill="#34a853"
            />
            <path
              d="M119.4 323.4c-10.5-31-10.5-64.3 0-95.3V157.4H28.6c-40.8 80.7-40.8 176.1 0 256.8l90.8-70.8z"
              fill="#fbbc04"
            />
            <path
              d="M272.1 107.4c38 0 72.3 13 99.4 34.4l74.6-74.6C407.4 27.1 345.6 0 272.1 0 165.7 0 73.8 61.5 28.6 150.5l90.8 70.7c21.5-64.4 81.7-112.3 152.7-112.3z"
              fill="#ea4335"
            />
          </svg>
          Sign In with Google
        </button>

        <p className="text-sm text-gray-500 text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="text-green-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
