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
import { useState } from "react";
import axios from 'axios';

export function Home() {
  const loadedCategories = useLoaderData();
  const [ bigCategories, setBigCategories ] = useState(loadedCategories.filter(cat => cat.budget_amount >= 200));
  const [ smallCategories, setSmallCategories ] = useState(loadedCategories.filter(cat => cat.budget_amount < 200));

  const testDates = () => {

    axios.get("http://localhost:5000/categories", {
        params: {
          startDate: '2025-05-01',
          endDate: '2025-05-30'
        }
      }).then(response => {
        setBigCategories(response.data.filter(cat=>cat.budget_amount >= 200));
        setSmallCategories(response.data.filter(cat=>cat.budget_amount < 200));
    })
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{display:"grid", gridTemplateColumns:"auto auto"}}>
        <BarChart data={smallCategories} title={"Small Budgets"}/>
        <BarChart data={bigCategories} title={"Big Budgets"}/>
      </div>
        {/* <LineChart /> */}
      <button onClick={()=>testDates()}>update dates</button>
    </div>
  );
};