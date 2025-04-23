import { useEffect, useState } from "react";
import axios from 'axios';

export function TransactionsIndex({tx, categories, setCategories, tags, onEdit}) {
  const [transactions, setTransactions] = useState(tx);

  const sortByDate = () => {
    const dateSorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    setTransactions(dateSorted);
  }

  const addCategory = async () => {
    const userInput = prompt("Please enter your input:", "enter a new category name");
    if (userInput !== null) {
      const params = new FormData();
      params.append('name', userInput);
      try {
        const postResponse = await axios.post('http://localhost:5000/categories', params);
        const newCategory = postResponse.data;
  
        const getResponse = await axios.get('http://localhost:5000/categories');
        setCategories(getResponse.data);
  
        console.log("Returning new category ID:", newCategory.id);
        return newCategory.id;
      } catch (error) {
        console.error("Error adding category:", error);
        return null;
      }
    } else {
      console.log("User cancelled the prompt.");
      return null;
    }
  }

  const handleCategorySelect = async (event, txId) => {
    event.preventDefault();
    const params = new FormData();
    let selection = event.target.value;
    if (selection === 'addCategory') {
      selection = await addCategory();
      if (!selection) {
        event.target.value = "";
        return;
      }
    }
    params.append("category", selection);
    axios.patch(`http://localhost:5000/transactions/${txId}`, params).then(response => {
      console.log(response.data);
      setTransactions(transactions.map(t => {
        return (t.id === txId)  
        ? {
          ...t,
          category_id: response.data.category_id,
          category: response.data.category
        }
        : t;
      }));
    })
    
  }
  const handleTagSelect = (event, txId) => {
    event.preventDefault();
    console.log(event.target.value);
    console.log(txId);
    const params = new FormData();
    params.append("tag", event.target.value);
    axios.patch(`http://localhost:5000/transactions/${txId}`, params).then(response => {
      console.log(response.data);
      setTransactions(transactions.map(t => {
        return (t.id === txId)
          ? {
              ...t,
              tag_id: response.data.tag_id,
              tag: response.data.tag
            }
          : t;
      }));
    })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate() + 1;
    const year = date.getFullYear();
    return month + "/" + day + "/" + year;
  }

  const TransactionItem = ({ t }) => (
    <div style={{border:"solid black 1px", padding:"10px"}}>
      <span style={{display: "inline-block", width:"140px"}}>{t.type}</span>
      <span style={{display: "inline-block", width:"150px"}}> {formatDate(t.date)}</span>
      <span style={{display: "inline-block", width:"100px"}}> {t.type==='DEPOSIT' ? `($${t.amount})` : `$${t.amount}`}</span>
      <span style={{display: "inline-block", width:"600px"}}> {t.payee}</span>
      {t.category ? 
        <span style={{display: "inline-block", width:"150px"}}>{t.category.name}</span>
        :
        (
          <div style={{display: "inline-block", width:"150px"}}>
            <select onChange={(event) => handleCategorySelect(event, t.id)} >
              <option name="category"></option>
              {categories?.map(category => (
                <option key={category.id} name="category" value={category.id}>{category.name}</option>
              ))}
              <option name="category" value="addCategory">+ add a Category</option>

            </select>
        </div>

        // use below for updating both category and tag later, maybe in a modal

        // <div style={{ display:"inline"}}>
        //   <form onSubmit={handleSelect} action="" style={{  width:"fit-content", display:"inline"}}>
        //     <label htmlFor="categories"></label>
        //     <select name="categories" >
        //       {categories.map(category => (
        //         <option key={category.id} value={category.name}>{category.name}</option>
        //       ))}
        //     </select>
        //     &nbsp;
        //   </form>
        //   {/* <input type="submit" value="select"/> */}
        // </div>
        )
      }
      {t.tag ? 
        <span style={{display: "inline-block", width:"150px"}}>{t.tag.name}</span>
        :
        (t.category?
          <div style={{display: "inline-block"}}>
            <select onChange={(event) => handleTagSelect(event, t.id)} >
            <option name="category"></option>
              {t.category.tags.map(tag => (
                <option key={tag.id} name="tag" value={tag.id}>{tag.name}</option>
              ))}
            </select>
        </div>:null
        )
      }
      {(t.category && t.tag)?
<button onClick={() => onEdit(t)}>edit</button>
      :
null
      }
    </div>
  )

  useEffect(sortByDate, []);

  return (
    <div>
      <h1>All transactions</h1>
      <div style={{ padding:"6px"}}>
        <span style={{display: "inline-block", width:"140px"}}>type</span>
        <span style={{display: "inline-block", width:"150px"}}>date</span>
        <span style={{display: "inline-block", width:"100px"}}>amount</span>
        <span style={{display: "inline-block", width:"600px"}}>payee</span>
        <span style={{display: "inline-block", width:"150px"}}>category</span>
        <span style={{display: "inline-block", width:"100px"}}>tag</span>
      </div>
      <div style={{width:"fit-content"}}>
        {transactions.map(t => (
          <TransactionItem key={t.id} t={t} />
        ))}
      </div>
    </div>
  );
}