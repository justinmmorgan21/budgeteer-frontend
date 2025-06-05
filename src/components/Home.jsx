// import { Link } from "react-router-dom";
// export function Home() {
//   return (
//     <div style={{width:"80%", margin:"20px auto"}}>
//       <h1>-- Dashboard goes here --</h1>
//       <Link to="/transactions">Go to transactions</Link>
//     </div>
//   )
// }


import { BarChart } from "./BarChart"; // adjust path if needed
import { LineChart } from "./LineChart";

export function Home() {
  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{display:"grid", gridTemplateColumns:"auto auto"}}>
        <BarChart />
        <LineChart />
      </div>
    </div>
  );
};