"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About <span className="text-indigo-600">ShopEase</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We’re on a mission to make shopping easier, faster, and more enjoyable.  
            Discover quality products with trusted service—all in one place.
          </p>
        </motion.div>

        {/* Company Image + Story */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Image
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
              alt="Our Store"
              width={600}
              height={400}
              className="rounded-2xl shadow-lg object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Story
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Founded with a vision to simplify shopping, ShopEase brings you a curated
              collection of products across fashion, electronics, lifestyle, and more.
              We combine modern technology with customer-first values to deliver an 
              unmatched experience.  
            </p>
          </motion.div>
        </div>

        {/* Mission / Vision / Values */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
            <h3 className="text-xl font-semibold text-indigo-600 mb-3">Our Mission</h3>
            <p className="text-gray-600">
              To empower customers by providing quality products at the best value,
              while ensuring seamless shopping experiences.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
            <h3 className="text-xl font-semibold text-indigo-600 mb-3">Our Vision</h3>
            <p className="text-gray-600">
              To be the most trusted and customer-friendly e-commerce platform, 
              setting benchmarks in service and innovation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
            <h3 className="text-xl font-semibold text-indigo-600 mb-3">Our Values</h3>
            <p className="text-gray-600">
              Integrity, innovation, and customer satisfaction drive everything we do.
              We’re committed to building trust with every purchase.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
