import { TransactionsIndex } from "./TransactionsIndex";
import { useLoaderData } from "react-router-dom";
import { useState } from 'react'

export function TransactionsPage() {
  const { transactions, cat, tags } = useLoaderData();
  const [ categories, setCategories ] = useState(cat);

  return (
    <main>
      <TransactionsIndex tx={transactions} categories={categories} setCategories={setCategories} tags={tags}/>
    </main>
  );
}