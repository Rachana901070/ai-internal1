import { useState, useEffect, useRef } from 'react';
import './HowItWorks.css';

const steps = [
  {
    title: "Post Surplus Food",
    description: "Donors share available meals with details like quantity, freshness, and pickup time.",
    icon: "📦"
  },
  {
    title: "Smart Collector Matching",
    description: "The system connects the nearest available collector based on time and capacity.",
    icon: "🚚"
  },
  {
    title: "Seamless Pickup & Delivery",
    description: "Collectors coordinate the pickup and deliver it safely to shelters or communities.",
    icon: "❤️"
  }
];

const impact = [
  { metric: "28k+", label: "Meals Redistributed", icon: "🍽️" },
  { metric: "5.2 tons", label: "Food Waste Prevented", icon: "♻️" },
  { metric: "92%", label: "Pickup Success Rate", icon: "✅" }
];

function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const increment = target / 100;
          const timer = setInterval(() => {
            setCount(prev => {
              if (prev >= target) {
                clearInterval(timer);
                return target;
              }
              return prev + increment;
            });
          }, 20);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{Math.floor(count)}{suffix}</span>;
}

export default function HowItWorks() {
  return (
    <div className="how-it-works">
      <div className="container">
        {/* Header Section */}
        <section className="header-section">
          <h2>How Maitri Dhatri Works</h2>
          <p>A simple, transparent journey — from donation to delivery.</p>
        </section>

        {/* Process Steps */}
        <section className="steps-section">
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={step.title} className="step-card">
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Impact Section */}
        <section className="impact-section">
          <h3>Impact so far</h3>
          <div className="impact-grid">
            {impact.map(item => (
              <div key={item.label} className="impact-card">
                <div className="impact-metric">
                  <AnimatedCounter target={parseFloat(item.metric)} suffix={item.metric.replace(/[\d.]/g, '')} />
                </div>
                <div className="impact-label">{item.icon} {item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="mission-text">
            <h4>Our Mission</h4>
            <p>At Maitri Dhatri, every meal matters. We connect kind-hearted donors with dedicated collectors to ensure that surplus food reaches those who need it most.</p>
          </div>
          <div className="mission-image">🌟</div>
        </section>
      </div>
    </div>
  );
}
