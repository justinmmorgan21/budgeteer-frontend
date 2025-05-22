import ProgressBar from "./ProgressBar";

// const bgColorList = ["yellow", "orange", "green", "red"];

// const bgColor = pct => {
//   let index = 0;
//   if (pct > 85 && pct < 97) index = 1;
//   else if (pct >= 97 && pct <= 103) index = 2;
//   else if (pct > 103) index = 3;
//   return bgColorList[index];
// }

export function BudgetsIndex({categories, onEdit }) {
  const CategoryItem = ({cat}) => (
    <div style={{border:"1px solid gray", padding:"12px", borderRadius:"5px", boxShadow:"gray 2px 2px"}}>
      <h3 style={{border:"0px solid gray"}}>{cat.name}</h3>
      <p>Actual: ${cat.accumulated}</p>
      {cat.budget_amount > 0 ?
        <div>
          <p>Budget: ${cat.budget_amount}</p>
          <ProgressBar actual={cat.accumulated} budget={cat.budget_amount} />
        </div>
        :
        null
      }
      {/* <progress id="file" max={cat.budget_amount} value={cat.accumulated}></progress> */}
      {/* <ul >
      {cat.tags.filter(tag=>!tag.archived && tag.name != '-').map(tag => (
          <li key={tag.id} style={{border:"0px solid gray"}}>{tag.name}</li>
        ))}
        </ul> */}
      <div style={{border:"0px solid gray", width:"100%", marginTop:"12px"}}>
        <button style={{float:"right"}} onClick={()=>onEdit(cat)}>more</button>
      </div>
    </div>
  )

  return (
    <div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px"}}>
        {categories.sort((a,b)=>a.name.localeCompare(b.name)).filter(cat=>!cat.archived).map(cat => (
          <CategoryItem key={cat.id} cat={cat} />
        ))}
      </div>
    </div>
  );
}