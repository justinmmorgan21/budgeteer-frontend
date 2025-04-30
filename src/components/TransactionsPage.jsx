import { TransactionsIndex } from "./TransactionsIndex";
import { useLoaderData } from "react-router-dom";
import { useState } from 'react';
import { Modal } from "./Modal";
import { TransactionEdit } from "./TransactionEdit";

export function TransactionsPage() {
  const { transactions: loadedTransactions, cat } = useLoaderData();
  const [ transactions, setTransactions ] = useState(loadedTransactions);
  const [ categories, setCategories ] = useState(cat);
  const [ modalVisible, setModalVisible ] = useState(false);
  const [ currentTx, setCurrentTx ] = useState(null);

  const handleClose = () => {
    setModalVisible(false);
  }

  const handleTxEdit = (tx) => {
    setModalVisible(true);
    setCurrentTx(tx);
  }

  const onUpdate = newTx => {
    setTransactions(prev => 
      prev.map(t => t.id === newTx.id ? newTx : t)
    )
  }

  const setTxInPage = async (data) => {
    setTransactions(data);
    
  }

  return (
    <main>
      <TransactionsIndex transactions={transactions} categories={categories} setCategories={setCategories} onEdit={handleTxEdit} setTransactions={setTransactions} setTxInPage={setTxInPage}/>
      <Modal onClose={handleClose} show={modalVisible}>
        <TransactionEdit onClose={handleClose} tx={currentTx} categories={categories} setCategories={setCategories} onUpdate={onUpdate}/>
      </Modal>
    </main>
  );
}