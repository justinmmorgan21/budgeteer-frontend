import { TransactionsIndex } from "./TransactionsIndex";
import { TransactionEdit } from "./TransactionEdit";
import { useLoaderData } from "react-router-dom";
import { useState, useRef, useEffect } from 'react';
import { Modal } from "./Modal";
import axios from 'axios';

export function TransactionsPage() {
  const { transactionsData: loadedTransactionsData, cat } = useLoaderData();
  const [ transactions, setTransactions ] = useState(loadedTransactionsData.transactions);
  const [ categories, setCategories ] = useState(cat);
  const [ modalVisible, setModalVisible ] = useState(false);
  const [ currentTx, setCurrentTx ] = useState(null);
  const fileInputRef = useRef(null);
  const [ currentPage, setCurrentPage ] = useState(loadedTransactionsData.current_page);
  const [ totalPages, setTotalPages ] = useState(loadedTransactionsData.total_pages);
  const [updatedCategory, setUpdatedCategory] = useState(null);
  const [updatedTransaction, setUpdatedTransaction] = useState(null);
  // const [ scrollPosition, setScrollPosition ] = useState(0);

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
      axios.get(`http://localhost:5000/transactions?page=${currentPage}&per_page=${25}`).then(response => {
        setTransactions(response.data.transactions);
        fileInputRef.current.value = null;
        setTotalPages(totalPages + response.data.total_pages);
        setCurrentPage(1);
      })
    })
  }

  const updatePagination = (newPageNum) => {
    setCurrentPage(newPageNum);
    axios.get(`http://localhost:5000/transactions?page=${newPageNum}&per_page=${25}`).then(response => {
      setTransactions(response.data.transactions);
    })
  }

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setScrollPosition(window.pageYOffset || document.documentElement.scrollTop);
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   handleScroll(); // Set initial scroll position on mount

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  // useEffect(() => {
  //   window.scrollTo(0, scrollPosition);
  // }, [scrollPosition]);

  useEffect(() => {
    if (updatedCategory) {
      setTransactions(prev => prev.map(tx =>
        tx.category.id === updatedCategory.id ?
          { ...tx, category: updatedCategory } : tx
        )
      );
    }
  }, [updatedCategory]);

  useEffect(() => {
    if (updatedTransaction) {
      setTransactions(prev => prev.map(tx =>
        tx.id == updatedTransaction.id ?
          updatedTransaction : tx
      ))
    }
  }, [updatedTransaction])

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
      <TransactionsIndex transactions={transactions} categories={categories} setCategories={setCategories} onEdit={handleTxEdit} 
                          setTransactions={setTransactions} setTxInPage={setTxInPage}/>
      <Modal onClose={handleClose} show={modalVisible}>
        <TransactionEdit onClose={handleClose} tx={currentTx} categories={categories} setCategories={setCategories} onUpdate={onUpdate} 
                          setUpdatedCategory={setUpdatedCategory} setUpdatedTransaction={setUpdatedTransaction}/>
      </Modal>
      <div style={{width:"100%", display:"flex", justifyContent:"center", gap:"12px"}}>
        {currentPage > 1 ? <span onClick={()=>updatePagination(currentPage - 1)} style={{cursor:"pointer", textDecoration:"underline"}}>{`<<`}</span> : null}
        <span> Page {currentPage} </span>
        {currentPage < totalPages ? <span onClick={()=>updatePagination(currentPage + 1)} style={{cursor:"pointer", textDecoration:"underline"}}>{`>>`}</span> : null}
      </div>
    </main>
  );
}