import { CategoriesIndex } from "./CategoriesIndex";
import { useLoaderData } from "react-router-dom";
import { useState } from 'react';
import { Modal } from "./Modal";

export function CategoriesPage() {
  const loadedCategories = useLoaderData();
  const [ categories, setCategories ] = useState(loadedCategories);
  const [ modalVisible, setModalVisible ] = useState(false);

  const handleClose = () => {
    setModalVisible(false);
  }

  // const handleTxEdit = (tx) => {
  //   setModalVisible(true);
  //   setCurrentTx(tx);
  // }

  // const onUpdate = newTx => {
  //   setTransactions(prev => 
  //     prev.map(t => t.id === newTx.id ? newTx : t)
  //   )
  // }

  // const setTxInPage = async (data) => {
  //   setTransactions(data);
    
  // }

  return (
    <main>
      <CategoriesIndex categories={categories} setCategories={setCategories} /> 
      {/* onEdit={handleTxEdit} setTxInPage={setTxInPage}/> */}
      <Modal onClose={handleClose} show={modalVisible}>
        {/* <TransactionEdit onClose={handleClose} categories={categories} setCategories={setCategories} /> */}
        {/* onUpdate={onUpdate}/> */}
      </Modal>
    </main>
  );
}