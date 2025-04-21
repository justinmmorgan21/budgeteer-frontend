import { TransactionsIndex } from "./TransactionsIndex";
import { useLoaderData } from "react-router-dom";

export function TransactionsPage() {
  const { transactions, categories, tags } = useLoaderData();

  return (
    <main>
      <TransactionsIndex tx={transactions} categories={categories} tags={tags}/>
    </main>
  );
}