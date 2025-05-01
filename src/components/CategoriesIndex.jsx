// import { useEffect } from "react";
// import axios from 'axios';

export function CategoriesIndex({categories, onEdit }) {

  // const addCategory = async () => {
  //   const userInput = prompt("Please enter a new category name:", "category name");
  //   if (userInput !== null) {
  //     const params = new FormData();
  //     params.append('name', userInput);
  //     try {
  //       const postResponse = await axios.post('http://localhost:5000/categories', params);
  //       const newCategory = postResponse.data;
  
  //       const getResponse = await axios.get('http://localhost:5000/categories');
  //       setCategories(getResponse.data);

  //       return newCategory.id;
  //     } catch (error) {
  //       console.error("Error adding category:", error);
  //       return null;
  //     }
  //   } else {
  //     console.log("User cancelled the prompt.");
  //     return null;
  //   }
  // }

  // const addTag = async (tx) => {
  //   const userInput = prompt("Please enter a new tag name for " + tx.category.name + ":", "tag name", tx.category.name);
  //   if (userInput !== null) {
  //     const params = new FormData();
  //     params.append('name', userInput);
  //     params.append('category_id', tx.category_id)
  //     try {
  //       const postResponse = await axios.post('http://localhost:5000/tags', params);
  //       return postResponse.data.id;
  //     } catch (error) {
  //       console.error("Error adding category:", error);
  //       return null;
  //     }
  //   } else {
  //     console.log("User cancelled the prompt.");
  //     return null;
  //   }
  // }

  // const handleCategorySelect = async (event) => {
  //   event.preventDefault();
  //   const params = new FormData();
  //   let selection = event.target.value;
  //   if (selection === 'addCategory') {
  //     selection = await addCategory();
  //     if (!selection) {
  //       event.target.value = "";
  //       return;
  //     }
  //   }
  //   params.append("category", selection);
  // }
  // const handleTagSelect = async (event, tx) => {
  //   event.preventDefault();
  //   const params = new FormData();
  //   let selection = event.target.value;
  //   if (selection === 'addTag') {
  //     selection = await addTag(tx);
  //     if (!selection) {
  //       event.target.value = "";
  //       return
  //     }
  //   }
  //   params.append("tag", selection);
  // }

  // const TransactionItem = ({ t }) => (
  //   <div style={{border:"solid black 1px", padding:"10px"}}>
  //     <span style={{display: "inline-block", width:"140px"}}>{t.type}</span>
  //     <span style={{display: "inline-block", width:"150px"}}> {formatDate(t.date)}</span>
  //     <span style={{display: "inline-block", width:"100px"}}> {t.type==='DEPOSIT' ? `($${t.amount})` : `$${t.amount}`}</span>
  //     <span style={{display: "inline-block", width:"600px"}}> {t.payee}</span>
  //     {t.category ? 
  //       <span style={{display: "inline-block", width:"150px"}}>{t.category.name}</span>
  //       :
  //       (
  //         <div style={{display: "inline-block", width:"150px"}}>
  //           <select onChange={(event) => handleCategorySelect(event, t.id)} >
  //             <option></option>
  //             {categories?.map(category => (
  //               <option key={category.id} value={category.id}>{category.name}</option>
  //             ))}
  //             <option value="addCategory">+ add a Category</option>
  //           </select>
  //       </div>
  //       )
  //     }
  //     {t.tag ? 
  //       <span style={{display: "inline-block", width:"150px"}}>{t.tag.name}</span>
  //       :
  //       (t.category?
  //         <div style={{display: "inline-block", width:"150px"}}>
  //           <select onChange={(event) => handleTagSelect(event, t)} >
  //           <option></option>
  //             {t.category.tags.map(tag => (
  //               <option key={tag.id} value={tag.id}>{tag.name}</option>
  //             ))}
  //             <option value="addTag">+ add a Tag</option>
  //           </select>
  //       </div>:null
  //       )
  //     }
  //     {t.category?
  //       <button onClick={() => {
  //         const latestTx = transactions.find(tr => tr.id === t.id);
  //         onEdit(latestTx);
  //       }}>edit</button>
      
  //       :
  //       null
  //     }
  //   </div>
  // )

  // useEffect(sortByDate, []);

  const CategoryItem = ({cat}) => (
    <div style={{border:"1px solid gray", padding:"12px", borderRadius:"5px", boxShadow:"gray 2px 2px"}}>
      <h2 style={{border:"0px solid gray"}}>{cat.name}</h2>
      {cat.tags.map(tag => (
        <ul key={tag.id}>
          <li style={{border:"0px solid gray"}}>{tag.name}</li>
        </ul>
      ))}
      <div style={{border:"0px solid gray", width:"100%"}}>
        <button style={{float:"right"}} onClick={()=>onEdit(cat)}>edit</button>
      </div>
    </div>
  )

  return (
    <div>
      <h1>All categories</h1>
      {/* <div style={{ padding:"6px"}}>
        <span style={{display: "inline-block", width:"140px"}}>type</span>
        <span style={{display: "inline-block", width:"150px"}}>date</span>
        <span style={{display: "inline-block", width:"100px"}}>amount</span>
        <span style={{display: "inline-block", width:"600px"}}>payee</span>
        <span style={{display: "inline-block", width:"150px"}}>category</span>
        <span style={{display: "inline-block", width:"100px"}}>tag</span>
      </div> */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px"}}>
        {categories.map(cat => (
          <CategoryItem key={cat.id} cat={cat} />
        ))}
      </div>
    </div>
  );
}