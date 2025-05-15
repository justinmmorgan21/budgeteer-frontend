
export function CategoriesIndex({categories, onEdit }) {
  const CategoryItem = ({cat}) => (
    <div style={{border:"1px solid gray", padding:"12px", borderRadius:"5px", boxShadow:"gray 2px 2px"}}>
      <h3 style={{border:"0px solid gray"}}>{cat.name}</h3>
      <p>Amount: ${cat.accumulated}</p>
      <p>Budgeted: ${cat.budget_amount}</p>
      {/* <ul >
      {cat.tags.filter(tag=>!tag.archived && tag.name != '-').map(tag => (
          <li key={tag.id} style={{border:"0px solid gray"}}>{tag.name}</li>
        ))}
        </ul> */}
      <div style={{border:"0px solid gray", width:"100%"}}>
        <button style={{float:"right"}} onClick={()=>onEdit(cat)}>more</button>
      </div>
    </div>
  )

  return (
    <div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px"}}>
        {categories.filter(cat=>!cat.archived).map(cat => (
          <CategoryItem key={cat.id} cat={cat} />
        ))}
      </div>
    </div>
  );
}