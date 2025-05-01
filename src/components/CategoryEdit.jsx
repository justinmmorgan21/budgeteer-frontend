import axios from "axios";
// import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CategoryEdit( { onClose, cat, onUpdate } ) {
  // const [category, setCategory] = useState(tx.category);
  const navigate = useNavigate();

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
  //       return newCategory;
  //     } catch (error) {
  //       console.error("Error adding category:", error);
  //       return null;
  //     }
  //   } else {
  //     console.log("User cancelled the prompt.");
  //     return null;
  //   }
  // }

  const addTag = async () => {
    const userInput = prompt("Please enter a new tag name for " + cat.name + ":", "tag name");
    if (userInput !== null) {
      // const params = new FormData();
      // params.append('name', userInput);
      // params.append('category_id', category.id)
      // try {
      //   const postResponse = await axios.post('http://localhost:5000/tags', params);
      //   const newTag = postResponse.data;

      //   const getResponse = await axios.get('http://localhost:5000/categories');
      //   setCategory(getResponse.data.find(cat=>cat.id == category.id))

      //   return newTag;
      // } catch (error) {
      //   console.error("Error adding category:", error);
      //   return null;
      // }
    } else {
      console.log("User cancelled the prompt.");
      return null;
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new FormData(event.target);
    axios.patch(`http://localhost:5000/categories/${cat.id}`, params).then(response => {
      onUpdate(response.data);
      onClose();
      navigate(`/transactions`);
    })
  }

  return (
      <div >
        <form onSubmit={handleSubmit} style={{width:"100%", display:"flex", flexDirection:"column"}}>
          <div>

          <label>Category: </label>
          <input type="text" defaultValue={cat.name}/>
          </div>
          <br />
          {/* <label htmlFor="categories"></label>
          <select onChange={async (e)=>{
            if (e.target.value === "addCategory") {
              const newCategory = await addCategory();
              if (newCategory) {
                setCategory(newCategory);
              }
            } else {
              setCategory(categories.find(cat=>cat.id == e.target.value))
            }
          }} value={category.id} name="category">
            {categories?.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
            <option value="addCategory">+ add a Category</option>
          </select> */}
          <span>Tags:</span>
          <label htmlFor="tags"></label>
          {/* <select onChange={async (e)=>{
            if (e.target.value === "addTag") {
              const newTag = await addTag();
              if (newTag) {
                setTag(newTag)
              }
            } else {
              setTag(e.target.value)
            }
          }} value={tag?.id} name="tag"> */}
            {cat.tags.map(tag => (
                <input key={tag.id} type="text" defaultValue={tag.name}/>
            ))}
            <br />
            <button onClick={()=>addTag()} value="addTag">+ add a Tag</button>
            <br />
          <div>
            <input type="submit" value="update"/>
            <button onClick={onClose}>cancel</button>
          </div>
        </form>
      </div>
  );
}