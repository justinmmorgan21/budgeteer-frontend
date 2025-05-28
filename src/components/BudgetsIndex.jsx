import ProgressBar from "./ProgressBar";

export function BudgetsIndex({categories, onEdit }) {
  const CategoryItem = ({cat}) => (
    <div style={{border:"1px solid gray", padding:"0 12px 6px 12px", borderRadius:"5px", boxShadow:"gray 2px 2px"}}>
      <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
        <h3 style={{border:"0px solid gray", margin:"6px 4px"}}>{cat.name}</h3>
        {cat.budget_amount > 0 ?
          <div style={{border:"0px solid black", display:"flex", flexDirection:"column"}}>
            <div style={{display:"flex", flexDirection:"row-reverse"}}>
            <span>{parseInt(cat.budget_amount)}</span>
            &nbsp;&nbsp;/&nbsp;&nbsp; 
            <span>${parseInt(cat.accumulated)}</span>
            </div>
          </div>
          :
          <p>Actual: ${parseInt(cat.accumulated)}</p>
        }
      </div>
      {cat.budget_amount > 0 ? <ProgressBar actual={cat.accumulated} budget={cat.budget_amount} /> : null}
      <div style={{border:"0px solid gray", width:"100%", marginTop:"12px"}}>
        <button style={{float:"right"}} onClick={()=>onEdit(cat)}>more</button>
      </div>
    </div>
  )

  return (
    <div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"16px"}}>
        {categories.sort((a,b)=>a.name.localeCompare(b.name)).filter(cat=>!cat.archived).map(cat => (
          <CategoryItem key={cat.id} cat={cat} />
        ))}
      </div>
    </div>
  );
}