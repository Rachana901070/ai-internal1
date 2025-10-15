import { useState } from "react";

const PRIORITY_OPTIONS = ["all", "high", "medium", "low"];
const STATUS_OPTIONS = ["all", "OPEN", "MATCHED", "COMPLETED", "PENDING"];

export default function FilterGroup(){
  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  return (
    <aside className="card" style={{display:"grid", gap:12, alignSelf:"flex-start"}}>
      <div>
        <label style={{fontWeight:600}}>Search</label>
        <input
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          placeholder="Search donations"
          style={{width:"100%", padding:12, borderRadius:10, border:"1px solid #cbd5e1"}}
        />
      </div>
      <div>
        <label style={{fontWeight:600}}>Priority</label>
        <select
          value={priority}
          onChange={(e)=>setPriority(e.target.value)}
          style={{width:"100%", padding:12, borderRadius:10, border:"1px solid #cbd5e1"}}
        >
          {PRIORITY_OPTIONS.map(option => (
            <option key={option} value={option}>{option.toUpperCase()}</option>
          ))}
        </select>
      </div>
      <div>
        <label style={{fontWeight:600}}>Status</label>
        <select
          value={status}
          onChange={(e)=>setStatus(e.target.value)}
          style={{width:"100%", padding:12, borderRadius:10, border:"1px solid #cbd5e1"}}
        >
          {STATUS_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <button className="btn">Apply Filters</button>
    </aside>
  );
}
