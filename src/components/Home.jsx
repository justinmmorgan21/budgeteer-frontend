// import { Link } from "react-router-dom";
// export function Home() {
//   return (
//     <div style={{width:"80%", margin:"20px auto"}}>
//       <h1>-- Dashboard goes here --</h1>
//       <Link to="/transactions">Go to transactions</Link>
//     </div>
//   )
// }

import { useLoaderData } from "react-router-dom";
import { BarChart } from "./BarChart"; // adjust path if needed
import { LineChart } from "./LineChart";
import { useState, useEffect } from "react";

export function Home() {
  const loadedCategories = useLoaderData();
  const [ bigCategories, setBigCategories ] = useState(loadedCategories.filter(cat => cat.budget_amount >= 200));
  const [ smallCategories, setSmallCategories ] = useState(loadedCategories.filter(cat => cat.budget_amount < 200));

  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{display:"grid", gridTemplateColumns:"auto auto"}}>
        <BarChart data={smallCategories} title={"Small Budgets"}/>
        <BarChart data={bigCategories} title={"Big Budgets"}/>
      </div>
        {/* <LineChart /> */}
      {/* <button onClick={()=>console.log(loadedCategories)}>PRINT LOG 1</button> */}
    </div>
  );
};