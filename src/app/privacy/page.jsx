export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Privacy Policy
        </h1>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Information We Collect</h2>
            <ul className="list-disc ml-5 text-gray-600 space-y-2">
              <li>Name, email, and address.</li>
              <li>Securely processed payment details.</li>
              <li>Cookies & analytics data for improvements.</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">How We Use Information</h2>
            <ul className="list-disc ml-5 text-gray-600 space-y-2">
              <li>Process & deliver orders.</li>
              <li>Provide customer support.</li>
              <li>Improve shopping experience.</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Data Protection</h2>
            <p className="text-gray-600">
              We use encryption & secure servers to protect your data. 
              We never sell or share your info without consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
