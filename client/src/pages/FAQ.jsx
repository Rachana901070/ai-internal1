const faqs = [
  {
    question: "Who can donate food?",
    answer: "Restaurants, cafeterias, community kitchens, and individuals with safe surplus food can create posts."
  },
  {
    question: "How fast is matching?",
    answer: "Our AI evaluates proximity and urgency to match collectors within minutes of a post going live."
  },
  {
    question: "Is there support for emergencies?",
    answer: "Yes, flagged high-priority posts trigger instant alerts to on-call collectors and partner NGOs."
  }
];

export default function FAQ(){
  return (
    <div className="container">
      <h2>FAQ & Support</h2>
      <p style={{color:"var(--muted)", marginBottom:20}}>Find quick answers or reach our support team at support@maitridhatri.org.</p>
      <div style={{display:"grid", gap:12}}>
        {faqs.map(item => (
          <details key={item.question} className="card">
            <summary style={{fontWeight:600}}>{item.question}</summary>
            <p style={{color:"var(--muted)", marginTop:8}}>{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
