import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CategoryEdit( { onClose, cat, onUpdate } ) {
  // const [category, setCategory] = useState(tx.category);
  const navigate = useNavigate();
  const originalCatName = cat.name;
  const [ tags, setTags ] = useState(cat.tags);
  const [ catName, setCatName ] = useState(cat.name);
  const [ inputTags, setInputTags ] = useState(cat.tags);

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

  const handleSubmit = async (event) => {
    console.log("submit");
    event.preventDefault();
    const params = new FormData(event.target);
    if (params.get("catName") !== originalCatName) {
      params.forEach((v,k) => console.log(k + ": " + v));
      const catUpdate = await axios.patch(`http://localhost:5000/categories/${cat.id}`, params)
      console.log(catUpdate.data);
    }
    const updatedTags = await Promise.all(
      tags.map(async (tag) => {
        if (params.has(tag.id) && params.get(tag.id) !== tag.name) {
          const tagUpdate = await axios.patch(`http://localhost:5000/tags/${tag.id}`, params)
          return { ...tag, name: tagUpdate.data.name };
        }
        return tag;
      })
    );
    onUpdate(catName, updatedTags);
    onClose();
    navigate(`/categories`);
  }

  const updateInputTag = (event, tag) => {
    setInputTags(inputTags.map(t => {
      return (t.id === tag.id) ?
        {
          ...t,
          name: event.target.value
        }
        :
        t;
    }));
  }

  return (
      <div >
        <form onSubmit={handleSubmit} style={{width:"100%", display:"flex", flexDirection:"column"}}>
          <div>

          <label htmlFor="catName">Category: </label>
          <input type="text" id="catName" name="catName" value={catName} onChange={(e) => setCatName(e.target.value)}/>
          </div>
          <br />
          <span>Tags:</span>
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
            {inputTags.map(tag => (
                <div key={tag.id}>
                  <label htmlFor={tag.name}></label>
                  <input type="text" id={tag.name} name={tag.id} value={tag.name} onChange={(event)=>updateInputTag(event, tag)}/>
                </div>
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