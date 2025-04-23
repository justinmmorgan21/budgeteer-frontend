import { TransactionsIndex } from "./TransactionsIndex";
import { useLoaderData } from "react-router-dom";
import { useState } from 'react';
import { Modal } from "./Modal";
import { TransactionEdit } from "./TransactionEdit";

export function TransactionsPage() {
  const { transactions, cat, tags } = useLoaderData();
  const [ categories, setCategories ] = useState(cat);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTx, setCurrentTx] = useState(null);

  const handleClose = () => {
    setModalVisible(false);
  }

  const handleTxEdit = (tx) => {
    setModalVisible(true);
    setCurrentTx(tx);
  }

  return (
    <main>
      <TransactionsIndex tx={transactions} categories={categories} setCategories={setCategories} tags={tags} onEdit={handleTxEdit}/>
      <Modal onClose={handleClose} show={modalVisible}>
        <TransactionEdit onClose={handleClose} tx={currentTx} categories={categories}/>
      </Modal>
    </main>
  );
}