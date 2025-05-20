import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";

const TagItem = ({ tag, updateInputTagName, updateInputTagBudget, deleteTag }) => (
  <div style={{ display: 'flex' }}>
    <div style={{marginBottom: "6px", border: "1px solid black", borderRadius: "5px", padding: "8px", display:'flex', flexDirection:"column"}}>
      <div key={tag.id} style={{ display:"flex", gap:"12px", marginBottom:"6px"}}>
        <div>
          <label htmlFor={tag.name}>name: </label>
          <input type="text" name={`${tag.id}_name`} value={tag.name} onChange={(event) => updateInputTagName(event, tag)} />
        </div>
        <div>
          <label htmlFor={tag.name}>budget: </label>
          <input type="text" name={`${tag.id}_budget`} value={tag.budget_amount} onChange={(event) => updateInputTagBudget(event, tag)} />
        </div>
        actual: ${tag.accumulated}
      </div>
      <progress id="file" max={tag.budget_amount} value={tag.accumulated} style={{width:"100%"}}></progress>
    </div>
    <a style={{ margin: "auto 0px", display: "inline", cursor: "pointer" }} onClick={(e) => deleteTag(e, tag)}>
      <IoCloseOutline />
    </a>
  </div>
);

export function BudgetModal( { onClose, cat, onUpdate } ) {
  const navigate = useNavigate();
  const originalCatName = cat.name;
  const originalBudget = cat.budget_amount;
  const [ tags, setTags ] = useState(cat.tags);
  const [ catName, setCatName ] = useState(cat.name);
  const [ inputTags, setInputTags ] = useState(cat.tags);
  const [ budget, setBudget ] = useState(cat.budget_amount);

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
        console.error("Error adding tag:", error);
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
    if (params.get("catName") !== originalCatName || params.get("budget") !== originalBudget) {
      await axios.patch(`http://localhost:5000/categories/${cat.id}`, params)
    }
    const updatedTags = await Promise.all(
      tags.map(async (tag) => {
        if (params.has(tag.id+"_name") && params.get(tag.id+"_name") != tag.name) {
          const tagUpdate = await axios.patch(`http://localhost:5000/tags/${tag.id}`, params)
          return { ...tag, name: tagUpdate.data.name };
        }
        else if (params.has(tag.id+"_budget") && params.get(tag.id+"_budget") != tag.budget_amount) {
          const tagUpdate = await axios.patch(`http://localhost:5000/tags/${tag.id}`, params)
          return { ...tag, budget_amount: tagUpdate.data.budget_amount };
        }
        return tag;
      })
    );
    onUpdate(params.get("catName"), updatedTags, null, params.get("budget"));
    onClose();
    navigate(`/budgets`);
  }

  const updateInputTagName = (event, tag) => {
    setInputTags(inputTags.map(t =>
      t.id === tag.id ? { ...t, name: event.target.value } : t
    ));
  }

  const updateInputTagBudget = (event, tag) => {
    setInputTags(inputTags.map(t =>
      t.id === tag.id ? { ...t, budget_amount: event.target.value } : t
    ));
  }

  const deleteTag = async (event, tag) => {
    const params = new FormData();
    params.append("archive", true);
    await axios.patch(`http://localhost:5000/tags/${tag.id}`, params)
    const getResponse = await axios.get('http://localhost:5000/categories');
    const updatedTags = getResponse.data.find(category=>category.id == cat.id).tags.filter(tag=>!tag.archived)
    setTags(updatedTags);
    setInputTags(updatedTags);
    onUpdate(cat.name, updatedTags, false);
  }

  const archive = () => {
    const params = new FormData();
    params.append("archive", true);
    axios.patch(`http://localhost:5000/categories/${cat.id}`, params).then(()=> {
      onUpdate(cat.name, cat.tags, true);
      tags.forEach(tag => {
        axios.patch(`http://localhost:5000/tags/${tag.id}`, params).then(()=> {
        })
      })
    })
  }

  return (
    <div >
      <form onSubmit={handleSubmit} style={{width:"100%", display:"flex", flexDirection:"column"}}>
        <div>
          <label htmlFor="catName">Category: </label>
          <input type="text" id="catName" name="catName" value={catName} onChange={(e) => setCatName(e.target.value)}/>
        </div>
        <br />
        <div>
          <label htmlFor="budget">Budget: </label>
          <input type="text" id="budget" name="budget" value={budget} onChange={(e) => setBudget(e.target.value)}/>
          {/* <input type="text" id="budget" name="budget" value={`$${budget}`} onChange={(e) => setBudget(e.target.value.startsWith("$") ? e.target.value.substring(1) : e.target.value)}/> */}
        </div>
        <br />
        <div>
          Actual this month: ${cat.accumulated}
        </div>
        <br />
        {inputTags.filter(tag => !tag.archived && tag.name !== '-').length > 0 ?
          (<div>
            <span style={{marginBottom:"6px"}}>Subcategories:</span>
            {inputTags.filter(tag => !tag.archived && tag.name !== '-').map(tag => (
              <TagItem key={tag.id} tag={tag} updateInputTagName={updateInputTagName} updateInputTagBudget={updateInputTagBudget} deleteTag={deleteTag} />
            ))}
            <br />
            Total from subcategories: {inputTags.filter(tag=>!tag.archived && tag.name != '-').reduce((acc, tag)=>acc+Number(tag.budget_amount), 0).toFixed(2)}
            <br />
            <br />
          </div>)
          :
          null
        }
        <button onClick={(e)=>{e.preventDefault(); addTag();}} value="addTag">+ add a Subcategory</button>
        <br />
        <div style={{display:"flex", justifyContent:"space-between"}}>
          <input type="submit" value="update"/>
          <button onClick={()=>archive()}>archive</button>
          <button onClick={onClose}>cancel</button>
        </div>
      </form>
    </div>
  );
}