import { useEffect } from "react";
import axios from 'axios';

export function TransactionsIndex({transactions, categories}) {
  const handleSelect = (event) => {
    event.preventDefault();
    const params = new FormData(event.target);
    console.log(params.get("categories"));
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
      <form onSubmit={handleSelect} action="" style={{  width:"fit-content", display:"inline"}}>
        <label htmlFor="categories"></label>
        <select name="categories" >
          {categories.map(category => (
            <option key={category.id} value={category.name}>{category.name}</option>
          ))}
        </select>
        &nbsp;
        <input type="submit" value="select"/>
      </form>
    </div>
  )

  const doThis = () => {
    console.log("post");
    const params = new FormData();
    params.append("category", 99);
    params.append("tag", 99);
    axios.post("http://localhost:5000/category_tags", params).then(response => {
      console.log(response.data);
    })
  }
  const doThat = () => {
    console.log("get");
    axios.get("http://localhost:5000/category_tags").then(response => {
      console.log(response.data);
    })
  }

  return (
    <div>
      <button onClick={()=>doThis()}>POST</button>
      <button onClick={()=>doThat()}>GET</button>
      <h1>All transactions</h1>
      <div style={{ padding:"6px"}}>
        <span style={{display: "inline-block", width:"140px"}}>type</span>
        <span style={{display: "inline-block", width:"150px"}}>date</span>
        <span style={{display: "inline-block", width:"100px"}}>amount</span>
        <span style={{display: "inline-block", width:"600px"}}>payee</span>
        <span >category</span>
      </div>
      <div>
        {transactions.map(t => (
          <TransactionItem key={t.id} t={t} />
        ))}
      </div>
    </div>
  );
}