import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addCategory } from "../utils/CategoryAndTagUtils";
import { addTag } from "../utils/CategoryAndTagUtils";
import { IoCloseOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";

export function TransactionEdit( { onClose, tx, categories, setCategories, onUpdate, setUpdatedCategory, setUpdatedTransaction, saveScroll } ) {
  const [category, setCategory] = useState(tx.category);
  const [splits, setSplits] = useState([]);
  const [tag, setTag] = useState(tx.tag);
  const [split, setSplit] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();
  const hasChildTransactions = tx.child_transactions.length > 0;

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

  // const addTag = async () => {
  //   const userInput = prompt("Please enter a new tag name for " + tx.category.name + ":", "tag name");
  //   if (userInput !== null) {
  //     const params = new FormData();
  //     params.append('name', userInput);
  //     params.append('category_id', category.id)
  //     try {
  //       const postResponse = await axios.post('http://localhost:5000/tags', params);
  //       const newTag = postResponse.data;

  //       const getResponse = await axios.get('http://localhost:5000/categories');
  //       const newCategory = getResponse.data.find(cat => cat.id == category.id);
  //       setCategory(newCategory);

  //       saveScroll();
  //       setUpdatedCategory(newCategory);

  //       return newTag;
  //     } catch (error) {
  //       console.error("Error adding category:", error);
  //       return null;
  //     }
  //   } else {
  //     console.log("User cancelled the prompt.");
  //     return null;
  //   }
  // }

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new FormData(event.target);
    axios.patch(`http://localhost:5000/transactions/${tx.id}`, params).then(response => {
      onUpdate(response.data);
      if (splits.length > 0) {
        const postPromises = splits.map((split) => {
          const splitParams = new FormData();
          splitParams.append('amount', split.amount);
          splitParams.append('category_id', split.category.id);
          splitParams.append('tag_id', split.tag.id);
          return axios.post(`http://localhost:5000/transactions/${tx.id}`, splitParams);
        })
        Promise.all(postPromises).then(()=>{
          onClose();
          navigate(`/transactions`);
        })
      } else {
        onClose();
        navigate(`/transactions`);
      }
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

  const handleSplitCategorySelect = async (event, index) => {
    event.preventDefault();
    let selection = event.target.value;
    if (selection === 'addCategory') {
      selection = await addCategory(setCategories);
      if (!selection) {
        event.target.value = "";
        return;
      }
    }
    setSplits(splits.map((split,i) => {
      if (index === i)
        split.category = categories.find(cat=>cat.id == selection)
      return split;
    }))
  }

  const handleSplitTagSelect = async (event, index) => {
    event.preventDefault();
    let selection = event.target.value;
    if (selection === 'addTag') {
      selection = await addTag(splits[index].category);
      if (!selection) {
        event.target.value = "";
        return;
      }
    }
    setSplits(splits.map((split,i) => {
      if (index === i)
        split.tag = splits[index].category.tags.find(t=>t.id == selection)
      return split;
    }))
  }

  const initSplits = async () => {
    if (tx.child_transactions.length > 0) {
      const responses = await Promise.all(
          tx.child_transactions.map(child_id =>
            axios.get(`http://localhost:5000/transactions/${child_id}`)
        )
      );
      setSplits(responses.map(response => {
        return {amount: response.data.amount, category: response.data.category, tag: response.data.tag}
      }));
    } else {
      setSplits(new Array(2).fill(null).map(() => ({amount: 0, category: null, tag: null})));
    }
  }

  const incrementSplits = (event) => {
    event.preventDefault();
    setSplits([...splits, {amount: 0, category: null, tag: null}]);
  }

  const deleteSplitItem = (index) => {
    const valToRemove = splits[index].amount;
    setSubtotal(subtotal - valToRemove);
    setSplits(prev => [
      ...prev.slice(0, index), ...prev.slice(index + 1)
    ]);
  }

  const handleInputChange = (event, index) => {
    const newSplits = [...splits];
    newSplits[index].amount = event.target.value;
    setSplits(newSplits);
  }

  useEffect(() => {
    const total = splits.map(split => split ? split.amount : 0).reduce((acc, val) => acc + parseFloat(val || 0), 0);
    setSubtotal(total);
  }, [splits]);

  useEffect(() => initSplits, []);

  return (
    <div>
      <span>{formatDate(tx.date)}</span>
      <h3>{tx.payee}</h3>
      <br />
      <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
        <span>{tx.type}</span>
        <span>${tx.amount}</span>
        <button style={{visibility: hasChildTransactions ? "hidden" : "visible"}} onClick={()=>setSplit(true)}>split</button>
      </div>
      <hr />
      <div style={{ display:"inline"}}>
        <form onSubmit={handleSubmit} style={{width:"100%", display:"flex", flexDirection:"column", gap:"12px"}}>
          <div style={{display:"flex", gap:"12px"}}>
            <label htmlFor="categories"></label>
            <select onChange={async (e)=>{
              if (e.target.value === "addCategory") {
                const newCategory = await addCategory(setCategories);
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
                const newTag = await addTag(tx, category, setCategory, setUpdatedCategory);
                if (newTag) {
                  setTag(newTag)
                }
              } else {
                setTag(category.tags.find(t => t.id == e.target.value))
              }
            }} value={tag?.id || ""} name="tag_id">
              <option value="">-- select a tag --</option>
              {category.tags?.filter(tag=>!tag.archived).map(tag => (
                  <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
              <option value="addTag">+ add a Tag</option>
            </select>
            <input type="submit" value="update"/>
            <button onClick={()=>reset()}>reset</button>
            <button onClick={onClose}>cancel</button>
          </div>
          <div style={{display:"flex", flexDirection:"column", gap:"6px", visibility: split || hasChildTransactions ? "visible" : "hidden"}}>
            <span>Split ${tx.amount} into:</span>
            {splits.map((split, i) => (
              <div key={i} style={{display:"flex", gap:"12px"}}>
                $ <input type="text" style={{width:"100px"}} value={split?.amount || ""} onChange={(e) => handleInputChange(e,i)} />
                <select onChange={(event) => handleSplitCategorySelect(event, i)} value={split.category ? split.category.id : ""}>
                  <option></option>
                  {categories?.sort((a,b)=>a.name.localeCompare(b.name)).map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                  <option value="addCategory">+ add a Category</option>
                </select>
                {split?.category != null ?
                  <select onChange={(event) => handleSplitTagSelect(event, i)} value={split.tag ? split.tag.id : ""}>
                    <option></option>
                    {split.category?.tags.sort((a,b)=>a.name.localeCompare(b.name)).map(tag => (
                      <option key={tag.id} value={tag.id}>{tag.name}</option>
                    ))}
                    <option value="addTag">+ add a Tag</option>
                  </select>
                  :
                  null
                }
                <a style={{ margin: "auto 0px", display: "inline", cursor: "pointer" }} onClick={() => deleteSplitItem(i)}>
                  <IoCloseOutline />
                </a>
              </div>
            ))}
            {Math.abs(tx.amount - subtotal) < 0.009 ?
              <div style={{color:"green"}}>
                <span>(${Math.abs(tx.amount - subtotal).toFixed(2)} left)</span>
                <FaCheck />
              </div>
              :
              <span style={{color:"red"}}>
                (${(tx.amount - subtotal).toFixed(2) >= 0 ? Math.abs(tx.amount - subtotal).toFixed(2) : (tx.amount - subtotal).toFixed(2)} left)
              </span>
            }
            <button style={{width:"25%"}} onClick={e=>incrementSplits(e)}>+ add a split item</button>
            {/* <button onClick={(e)=>{e.preventDefault(); console.log("splits: ", splits); console.log("subtotal: ", subtotal)}}>test</button> */}
          </div>
        </form>
      </div>
    </div>
  );
}