import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function TransactionEdit( { onClose, tx, categories, setCategories, onUpdate, setUpdatedCategory, setUpdatedTransaction, saveScroll } ) {
  const [category, setCategory] = useState(tx.category);
  const [tag, setTag] = useState(tx.tag);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    let month = date.getMonth() + 1;
    let day = date.getDate() + 1;
    let year = date.getFullYear();
    const isLeapYear = year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)
    if (((month===1||month===3||month===5||month===7||month===8||month===10||month===12) && day === 32) ||
        ((month===4||month===6||month===9||month===11) && day === 31) ||
        (!isLeapYear && (month===2) && day === 29) ||
        (isLeapYear && (month===2) && day === 30)) {
      month++;
      day = 1;
      if (month===13) {
        month = 1;
        year++;
      }
    }
    return month + "/" + day + "/" + year;
  }

  const addCategory = async () => {
    const userInput = prompt("Please enter a new category name:", "category name");
    if (userInput !== null) {
      const params = new FormData();
      params.append('name', userInput);
      try {
        const postResponse = await axios.post('http://localhost:5000/categories', params);
        const newCategory = postResponse.data;
  
        const getResponse = await axios.get('http://localhost:5000/categories');
        setCategories(getResponse.data);
        return newCategory;
      } catch (error) {
        console.error("Error adding category:", error);
        return null;
      }
    } else {
      console.log("User cancelled the prompt.");
      return null;
    }
  }

  const addTag = async () => {
    const userInput = prompt("Please enter a new tag name for " + tx.category.name + ":", "tag name");
    if (userInput !== null) {
      const params = new FormData();
      params.append('name', userInput);
      params.append('category_id', category.id)
      try {
        const postResponse = await axios.post('http://localhost:5000/tags', params);
        const newTag = postResponse.data;

        const getResponse = await axios.get('http://localhost:5000/categories');
        const newCategory = getResponse.data.find(cat => cat.id == category.id);
        setCategory(newCategory);

        saveScroll();
        setUpdatedCategory(newCategory);

        return newTag;
      } catch (error) {
        console.error("Error adding category:", error);
        return null;
      }
    } else {
      console.log("User cancelled the prompt.");
      return null;
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new FormData(event.target);
    axios.patch(`http://localhost:5000/transactions/${tx.id}`, params).then(response => {
      onUpdate(response.data);
      onClose();
      navigate(`/transactions`);
    })
  }

  const reset = () => {
    const params = new FormData();
    params.append('category_id', '');
    params.append('tag_id', '');
    axios.patch(`http://localhost:5000/transactions/${tx.id}`, params).then(response => {
      saveScroll();
      setUpdatedTransaction(response.data);
      onClose();
      navigate('/transactions');
    })
  }

  return (
    <div>
      <span>{formatDate(tx.date)}</span>
      <h3>{tx.payee}</h3>
      <br />
      <div style={{width:"50%", display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
        <span>{tx.type}</span>
        <span>${tx.amount}</span>
      </div>
      <hr />
      <div style={{ display:"inline"}}>
        <form onSubmit={handleSubmit} style={{width:"100%", display:"flex", flexDirection:"row", gap:"12px"}}>
          <label htmlFor="categories"></label>
          <select onChange={async (e)=>{
            if (e.target.value === "addCategory") {
              const newCategory = await addCategory();
              if (newCategory) {
                setCategory(newCategory);
              }
            } else {
              setCategory(categories.find(cat=>cat.id == e.target.value))
            }
          }} value={category.id} name="category_id">
            {categories?.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
            <option value="addCategory">+ add a Category</option>
          </select>
          <label htmlFor="tags"></label>
          <select onChange={async (e)=>{
            if (e.target.value === "addTag") {
              const newTag = await addTag();
              if (newTag) {
                setTag(newTag)
              }
            } else {
              setTag(category.tags.find(t => t.id == e.target.value))
            }
          }} value={tag?.id || ""} name="tag_id">
            <option value="">-- select a tag --</option>
            {category.tags.filter(tag=>!tag.archived).map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
            <option value="addTag">+ add a Tag</option>
          </select>
          <input type="submit" value="update"/>
          <button onClick={()=>reset()}>reset</button>
          <button onClick={onClose}>cancel</button>
        </form>
      </div>
    </div>
  );
}