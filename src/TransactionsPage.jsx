import axios from "axios";
import { useState, useEffect } from "react";
import { TransactionsIndex } from "./TransactionsIndex";

export function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);

  const handleIndex = () => {
    console.log("handleIndex");
    axios.get("http://localhost:5000/transactions").then(response => {
        console.log("response: ", response.data);
        setTransactions(response.data);
      }
    )
  }

  useEffect(handleIndex, []);

  return (
    <main>
      <TransactionsIndex tx={transactions}/>
    </main>
  )
}