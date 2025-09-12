export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Shipping & Returns
        </h1>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Shipping Policy */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Shipping Policy</h2>
            <ul className="list-disc ml-5 space-y-2 text-gray-600">
              <li>Orders processed in 1-2 business days.</li>
              <li>Delivery: 3-7 business days in India.</li>
              <li>International: 10-15 business days.</li>
            </ul>
          </div>

          {/* Return Policy */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Return Policy</h2>
            <p className="text-gray-600 mb-3">
              If you’re not fully satisfied, return within <strong>7 days</strong>.
            </p>
            <ul className="list-disc ml-5 space-y-2 text-gray-600">
              <li>Items must be unused & original packaging.</li>
              <li>Refunds issued to original payment method.</li>
              <li>Return shipping costs are non-refundable.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
