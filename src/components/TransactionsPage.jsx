import axios from "axios";
import { useState, useEffect } from "react";
import { TransactionsIndex } from "./TransactionsIndex";

export function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionResult, categoryResult] = await Promise.all([
          axios.get("http://localhost:5000/transactions"),
          axios.get("http://localhost:5000/categories"),
        ]);
        setTransactions(transactionResult.data);
        setCategories(categoryResult.data);
      } catch (err) {
        console.error("Error loading data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <main>
      <TransactionsIndex transactions={transactions} categories={categories}/>
    </main>
  );
}