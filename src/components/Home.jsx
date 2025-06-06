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

export function Home() {
  const loadedCategories = useLoaderData();
  const [ categories, setCategories ] = useState(loadedCategories);
  // console.log(categories);
  return (
    <div>
      <h1>Dashboard</h1>
      {/* <div style={{display:"grid", gridTemplateColumns:"auto auto"}}> */}
        <BarChart data={categories}/>
      {/* </div> */}
        {/* <LineChart /> */}
    </div>
  );
};