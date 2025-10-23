import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { submitContactForm } from "../services/contactService.js";

const faqs = [
  {
    question: "Who can donate food?",
    answer: "Restaurants, cafeterias, community kitchens, and individuals with safe surplus food can create posts. We ensure all donations meet food safety standards.",
    icon: "🍽️",
    category: "Donating"
  },
  {
    question: "How fast is matching?",
    answer: "The system evaluates proximity and urgency to connect collectors within minutes of a post going live. Most matches happen within 30 minutes.",
    icon: "⚡",
    category: "Matching"
  },
  {
    question: "Is there support for emergencies?",
    answer: "Yes, flagged high-priority posts trigger instant alerts to on-call collectors and partner NGOs. We prioritize urgent food needs.",
    icon: "🚨",
    category: "Support"
  },
  {
    question: "How do I become a collector?",
    answer: "Register as a collector on our platform. You'll need to provide identification and vehicle details. Training on food handling is provided.",
    icon: "🚛",
    category: "Collecting"
  },
  {
    question: "What about food safety?",
    answer: "All donations must be safe and properly stored. Collectors are trained in food safety protocols, and we monitor the entire process.",
    icon: "🛡️",
    category: "Safety"
  },
  {
    question: "Is my data secure?",
    answer: "We use industry-standard encryption and follow data protection regulations. Your personal information is never shared without consent.",
    icon: "🔒",
    category: "Privacy"
  },
  {
    question: "How do I report an issue?",
    answer: "Use the contact form below or email support@maitridhatri.org. We investigate all reports within 24 hours.",
    icon: "📞",
    category: "Support"
  },
  {
    question: "Are there any fees?",
    answer: "The platform is free for donors and collectors. We rely on partnerships and donations to keep operations running.",
    icon: "💰",
    category: "General"
  }
];

const categories = ["All", "Donating", "Collecting", "Matching", "Safety", "Privacy", "Support", "General"];

export default function FAQ() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      await submitContactForm(formData);
      setSubmitMessage("Thank you for your message. Our support team will get back to you shortly.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setSubmitMessage("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFaqs = selectedCategory === "All" ? faqs : faqs.filter(faq => faq.category === selectedCategory);
  const popularTopics = faqs.slice(0, 4); // First 4 FAQs as popular topics

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">FAQ & Support</h1>
          <p className="text-gray-600 mb-6">
            Find quick answers to your questions or get in touch with our support team for personalized assistance.
          </p>
          <a
            href="mailto:support@maitridhatri.org"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition inline-block"
          >
            Contact Support
          </a>
        </div>

        {/* Popular Topics */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            🔥 Popular Topics
          </h2>
          <div className="space-y-3">
            {popularTopics.map((faq, index) => (
              <div key={faq.question} className="text-sm">
                <span className="font-medium text-gray-800">{faq.icon} {faq.question}</span>
                <p className="text-gray-600 mt-1">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Browse by Category */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            📂 Browse by Category
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full cursor-pointer transition ${
                  selectedCategory === category
                    ? "bg-green-200 text-green-800"
                    : "bg-gray-100 hover:bg-green-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 mb-10">
          {filteredFaqs.map((faq, index) => (
            <div
              key={faq.question}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <details className="group">
                <summary className="cursor-pointer text-lg font-medium text-gray-800 flex items-center justify-between">
                  <span>{faq.question}</span>
                  <ChevronDownIcon className="w-5 h-5 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-gray-600 transition-all duration-300 ease-in-out">
                  {faq.answer}
                </p>
              </details>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-green-50 p-6 rounded-xl shadow-inner">
          <h2 className="text-2xl font-semibold mb-3">Still have questions?</h2>
          <p className="text-gray-600 mb-4">
            Fill out the form below and our support team will reach out to you.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
              required
            />
            <textarea
              placeholder="Your Message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
              rows={4}
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
          {submitMessage && (
            <p className="mt-4 text-center text-gray-600">{submitMessage}</p>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-gray-600">
          Need urgent help? Reach out to us at support@maitridhatri.org
        </div>
      </div>

      <style jsx>{`
        details[open] summary ~ p {
          max-height: 500px;
          opacity: 1;
        }
        details summary ~ p {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}
