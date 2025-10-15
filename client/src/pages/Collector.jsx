import StatCard from "../components/StatCard.jsx";
import DonationCard from "../components/DonationCard.jsx";
import FilterGroup from "../components/FilterGroup.jsx";

export default function Collector(){
  return (
    <div className="container">
      <h2>Collector Dashboard</h2>
      <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, margin:"12px 0"}}>
        <StatCard label="Today's Pickups" value="24" />
        <StatCard label="Total Collections" value="156" />
        <StatCard label="Rating" value="4.8 ★" />
        <StatCard label="Active Pickups" value="3" />
      </div>
      <div style={{display:"grid", gridTemplateColumns:"260px 1fr", gap:16}}>
        <FilterGroup />
        <div>
          <div style={{display:"grid", gap:12}}>
            <DonationCard title="Rice & Curry" qty="20 servings" timeLeft="1.5 hours" distance="0.8 km" priority="high" />
          </div>
        </div>
      </div>
    </div>
  );
}
