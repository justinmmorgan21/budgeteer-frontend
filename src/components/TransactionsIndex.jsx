import { useState } from "react";
import axios from 'axios';

export function TransactionsIndex({tx, categories, tags}) {
  const [transactions, setTransactions] = useState(tx);

  const handleCategorySelect = (event, txId) => {
    event.preventDefault();
    const params = new FormData();
    params.append("category", event.target.value);
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
    // event.preventDefault();
    // console.log(event.target.value);
    // console.log(txId);
    // const params = new FormData();
    // params.append("tag", event.target.value);
    // params.append("category", 1);
    // axios.post("http://localhost:5000/category_tags", params).then(response => {
    //   console.log(response.data);
    //   const txParams = new FormData();
    //   txParams.append("category_tag", response.data.id);
    //   axios.patch(`http://localhost:5000/transactions/${txId}`, txParams).then(response => {
    //     console.log(response.data);
    //     setTransactions(transactions.map(t => {
    //       return (t.id === txId)
    //         ? {
    //             ...t,
    //             category_tag_id: response.data.category_tag_id,
    //             category_tag: response.data.category_tag
    //           }
    //         : t;
    //     }));
    //   })
    // })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDay() + 1;
    const year = date.getFullYear();
    return month + "/" + day + "/" + year;
  }

  const TransactionItem = ({ t }) => (
    <div style={{border:"solid black 1px", padding:"10px"}}>
      <span style={{display: "inline-block", width:"140px"}}>{t.type}</span>
      <span style={{display: "inline-block", width:"150px"}}> {formatDate(t.date)}</span>
      <span style={{display: "inline-block", width:"100px"}}> ${t.amount}</span>
      <span style={{display: "inline-block", width:"600px"}}> {t.payee}</span>
      {t.category ? 
        <span style={{display: "inline-block", width:"150px"}}>{t.category.name}</span>
        :
        (
          <div style={{display: "inline-block", width:"150px"}}>
            <select onChange={(event) => handleCategorySelect(event, t.id)} >
              {categories.map(category => (
                <option key={category.id} name="category" value={category.id}>{category.name}</option>
              ))}
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
        <span>{t.tag.name}</span>
        :
        (t.category?
          <div style={{display: "inline-block"}}>
            <select onChange={(event) => handleTagSelect(event, t.id)} >
              {t.category.tags.map(tag => (
                <option key={tag.id} name="tag" value={tag.id}>{tag.name}</option>
              ))}
            </select>
        </div>:null
        )
      }
    </div>
  )

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