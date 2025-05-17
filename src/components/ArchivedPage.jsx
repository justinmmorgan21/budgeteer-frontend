import { BudgetsIndex } from "./BudgetsIndex";
import { BudgetModal } from "./BudgetModal";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { Modal } from "./Modal";
import axios from 'axios';
import { IoMdArrowBack } from "react-icons/io";

export function ArchivedPage() {
  const archived = useLoaderData();
  const [ categories, setCategories ] = useState(archived.categories);
  const [ tags, setTags ] = useState(archived.tags);

  const navigate = useNavigate();

  const unarchiveCat = (cat) => {
    const params = new FormData();
    params.append("archive", false);
    axios.patch(`http://localhost:5000/categories/${cat.id}`, params).then(()=> {
      setCategories(categories.filter(c => c.id != cat.id));
      cat.tags.forEach(tag => {
        axios.patch(`http://localhost:5000/tags/${tag.id}`, params).then(()=> {
        })
      })
    })
  }

  const unarchiveTag = (tag) => {
    const params = new FormData();
    params.append("archive", false);
    axios.patch(`http://localhost:5000/tags/${tag.id}`, params).then(() => {
      setTags(tags.filter(t => t.id != tag.id));
    })
  }

  return (
    <main style={{width:"80%", margin:"20px auto"}}>
      <div style={{cursor:"pointer"}} onClick={()=>navigate("/budgets")}>
        <IoMdArrowBack /> <span style={{textDecoration:"underline"}}>back to Categories</span>
      </div>
      <h1>Archived</h1>
      <div style={{display:"flex", width:"100%"}}>
        <div style={{width:"50%"}}>
          <h3>Categories</h3>
          {categories.map(cat => (
            <div key={cat.id} style={{border:"1px solid black", borderRadius:"5px", width:"50%", padding:"12px"}}>
              <div style={{display:"flex", justifyContent:"space-between"}}>
                <span>{cat.name}</span> <button onClick={()=>unarchiveCat(cat)}>reactivate</button>
              </div>
              <ul>
                {cat.tags.map(tag => (
                  <li key={tag.id}>
                    {tag.name}
                  </li>
                ))}
              </ul>
              
            </div>
          ))}
        </div>
        <div style={{width:"50%"}}>
          <h3>Tags</h3>
          {tags.filter(tag=>!tag.category.archived).map(tag => (
            <div key={tag.id}>
              <button onClick={()=>unarchiveTag(tag)}>reactivate</button> {tag.name} (Category: {tag.category.name})
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}