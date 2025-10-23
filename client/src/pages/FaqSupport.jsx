import { useState, useEffect, useMemo } from 'react';
import { ChevronDown, Mail, HelpCircle, AlertTriangle } from 'lucide-react';
import { faqData } from '../data/faqData.js';
import SupportFormModal from '../components/SupportFormModal.jsx';

// Reusable AccordionItem component
function AccordionItem({ title, content, isOpen, onToggle, id }) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 shadow-sm bg-white transition-all">
      <button
        onClick={onToggle}
        className="flex justify-between w-full text-left font-medium text-gray-900"
      >
        {title}
        <ChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40 mt-3" : "max-h-0"
        }`}
      >
        <p className="text-gray-600">{content}</p>
      </div>
    </div>
  );
}

export default function FaqSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [openItem, setOpenItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter FAQs based on search
  const filteredFaqs = useMemo(() => {
    if (!debouncedQuery.trim()) return faqData;

    const query = debouncedQuery.toLowerCase();
    return faqData.map(group => ({
      ...group,
      questions: group.questions.filter(q =>
        q.q.toLowerCase().includes(query) || q.a.toLowerCase().includes(query)
      )
    })).filter(group => group.questions.length > 0);
  }, [debouncedQuery]);

  const toggleItem = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  const openModal = (category = '') => {
    setModalCategory(category);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalCategory('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">FAQ & Support</h1>
          <p className="text-gray-600">Quick answers and easy ways to contact us.</p>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mt-6 mb-8 p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-400 focus:outline-none"
        />

        {/* FAQ Categories */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600">No results found. Try a different keyword.</p>
          </div>
        ) : (
          filteredFaqs.map((group, groupIndex) => (
            <div key={group.group}>
              <h2 className="text-2xl font-semibold mt-10 mb-4">{group.group}</h2>
              <div className="space-y-4">
                {group.questions.map((q, qIndex) => {
                  const id = `${groupIndex}-${qIndex}`;
                  return (
                    <AccordionItem
                      key={id}
                      id={id}
                      title={q.q}
                      content={q.a}
                      isOpen={openItem === id}
                      onToggle={() => toggleItem(id)}
                    />
                  );
                })}
              </div>
            </div>
          ))
        )}

        {/* Quick Help Section */}
        <div className="mt-12 p-6 bg-green-50 border border-green-200 rounded-xl text-center">
          <h3 className="text-lg font-semibold text-gray-800">Need more help?</h3>
          <p className="text-gray-600 mt-1">Contact us or report an issue anytime.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => openModal()}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Contact Support
            </button>
            <button
              onClick={() => openModal('bug')}
              className="px-5 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-100"
            >
              Report Issue
            </button>
          </div>
        </div>
      </div>

      <SupportFormModal isOpen={modalOpen} onClose={closeModal} prefillCategory={modalCategory} />
    </div>
  );
}
