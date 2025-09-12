export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Terms & Conditions
        </h1>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Use of Website</h2>
            <ul className="list-disc ml-5 text-gray-600 space-y-2">
              <li>Must be 18+ or have parental consent.</li>
              <li>No misuse of website/services.</li>
              <li>Content belongs to ShopEase, no copying.</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Orders & Payments</h2>
            <ul className="list-disc ml-5 text-gray-600 space-y-2">
              <li>Orders subject to availability.</li>
              <li>Prices may change without notice.</li>
              <li>Payments required before processing.</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Liability</h2>
            <p className="text-gray-600">
              ShopEase is not liable for delays or damages beyond our control.  
              No responsibility for indirect losses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
