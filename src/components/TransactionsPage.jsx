import { TransactionsIndex } from "./TransactionsIndex";
import { useLoaderData } from "react-router-dom";

export function TransactionsPage() {
  const { transactions, categories } = useLoaderData();

  return (
    <main>
      <TransactionsIndex tx={transactions} categories={categories}/>
    </main>
  );
}