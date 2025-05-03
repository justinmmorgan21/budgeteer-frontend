import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
export function CategoryEdit( { onClose, cat, onUpdate } ) {
  const navigate = useNavigate();
  const originalCatName = cat.name;
  const [ tags, setTags ] = useState(cat.tags);
  const [ catName, setCatName ] = useState(cat.name);
  const [ inputTags, setInputTags ] = useState(cat.tags);

  const addTag = async () => {
    const userInput = prompt("Please enter a new tag name for " + cat.name + ":", "tag name");
    if (userInput !== null) {
      const params = new FormData();
      params.append('name', userInput);
      params.append('category_id', cat.id);
      try {
        await axios.post('http://localhost:5000/tags', params);
        const getResponse = await axios.get('http://localhost:5000/categories');
        const updatedTags = getResponse.data.find(category=>category.id == cat.id).tags
        setTags(updatedTags);
        setInputTags(updatedTags);
        onUpdate(cat.name, updatedTags);
      } catch (error) {
        console.error("Error adding category:", error);
        return null;
      }
    } else {
      console.log("User cancelled the prompt.");
      return null;
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const params = new FormData(event.target);
    if (params.get("catName") !== originalCatName) {
      await axios.patch(`http://localhost:5000/categories/${cat.id}`, params)
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
    setInputTags(inputTags.map(t =>
      t.id === tag.id ? { ...t, name: event.target.value } : t
    ));
  }

  const deleteTag = async (event, tag) => {
    await axios.delete(`http://localhost:5000/tags/${tag.id}`)
    const getResponse = await axios.get('http://localhost:5000/categories');
    const updatedTags = getResponse.data.find(category=>category.id == cat.id).tags
    setTags(updatedTags);
    setInputTags(updatedTags);
    onUpdate(cat.name, updatedTags);
  }

  return (
    <div >
      <form onSubmit={handleSubmit} style={{width:"100%", display:"flex", flexDirection:"column"}}>
        <div>
          <label htmlFor="catName">Category: </label>
          <input type="text" id="catName" name="catName" value={catName} onChange={(e) => setCatName(e.target.value)}/>
        </div>
        <br />
        <span style={{marginBottom:"6px"}}>Tags:</span>
        {inputTags.map(tag => (
          <div key={tag.id} style={{marginBottom:"6px"}}>
            <label htmlFor={tag.name}></label>
            <input type="text"  name={tag.id} value={tag.name} onChange={(event)=>updateInputTag(event, tag)}/>
            <a style={{margin:"auto 0px", display:"inline", cursor:"pointer"}} onClick={(e)=>deleteTag(e, tag)}>
              <IoCloseOutline />
            </a>
          </div>
        ))}
        <br />
        <button onClick={(e)=>{e.preventDefault(); addTag();}} value="addTag">+ add a Tag</button>
        <br />
        <div>
          <input type="submit" value="update"/>
          <button onClick={onClose}>cancel</button>
        </div>
      </form>
    </div>
  );
}