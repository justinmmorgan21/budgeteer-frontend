import { TransactionsIndex } from "./TransactionsIndex";
import { TransactionEdit } from "./TransactionEdit";
import { useLoaderData } from "react-router-dom";
import { useState, useRef } from 'react';
import { Modal } from "./Modal";
import axios from 'axios';

export function TransactionsPage() {
  const { transactions: loadedTransactions, cat } = useLoaderData();
  const [ transactions, setTransactions ] = useState(loadedTransactions);
  const [ categories, setCategories ] = useState(cat);
  const [ modalVisible, setModalVisible ] = useState(false);
  const [ currentTx, setCurrentTx ] = useState(null);
  const fileInputRef = useRef(null);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);

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

  const fileUpload = (event) => {
    event.preventDefault();
    const params = new FormData(event.target);
    axios.post("http://localhost:5000/transactions/upload", params).then(() => {
      axios.get("http://localhost:5000/transactions").then(response => {
        console.log("response: ", response.data);
        const newTransactions = response.data;
        setTransactions(newTransactions);
        fileInputRef.current.value = null;
      })
    })
  }

  return (
    <main style={{width:"80%", margin:"20px auto"}}>
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <h1>All transactions</h1>
        <form style={{border:"1px solid black", padding:"12px", borderRadius:"5px"}} onSubmit={(event)=>fileUpload(event)}>
          <div style={{display:'flex', flexDirection:"column", gap:"6px"}}>
            <label htmlFor="file">Upload Statement:</label>
            <input type="file" id="file" name="file" ref={fileInputRef} style={{height:"fit-content"}} />
            <input type="submit" />
          </div>
        </form>
      </div>
      <br />
      <TransactionsIndex transactions={transactions} categories={categories} setCategories={setCategories} onEdit={handleTxEdit} setTransactions={setTransactions} setTxInPage={setTxInPage}/>
      <Modal onClose={handleClose} show={modalVisible}>
        <TransactionEdit onClose={handleClose} tx={currentTx} categories={categories} setCategories={setCategories} onUpdate={onUpdate}/>
      </Modal>
    </main>
  );
}