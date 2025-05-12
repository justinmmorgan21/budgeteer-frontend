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
  const scrollYRef = useRef(0);
  const [ searchText, setSearchText ] = useState("");

  const saveScroll = () => {
    scrollYRef.current = window.scrollY;
  };

  const restoreScroll = () => {
    window.scrollTo({ top: scrollYRef.current, behavior: 'instant' });
  };

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
    saveScroll();
    const params = new FormData(event.target);
    axios.post("http://localhost:5000/transactions/upload", params).then(() => {
      setCurrentPage(1);
      axios.get(`http://localhost:5000/transactions?page=${1}&per_page=${25}`).then(response => {
        setTransactions(response.data.transactions);
        fileInputRef.current.value = null;
        setTotalPages(response.data.total_pages);
      })
    })
  }

  const updatePagination = (newPageNum) => {
    saveScroll();
    setCurrentPage(newPageNum);
    axios.get(`http://localhost:5000/transactions?page=${newPageNum}&per_page=${25}`).then(response => {
      setTransactions(response.data.transactions);
    })
  }

  const PageList = () => {
    const pageNums = [];
    const pageChoices = 9;
    let startPageNum = currentPage - Math.floor(pageChoices / 2);
    if (currentPage >= 1 && currentPage <= Math.floor(pageChoices / 2) || totalPages < pageChoices - 1) { 
      startPageNum = 1; 
    } else if (totalPages - currentPage < (Math.floor(pageChoices / 2) + 1)) { 
      startPageNum = totalPages - (pageChoices - 1); 
    }
    for (let i = startPageNum; i < Math.min(startPageNum + pageChoices, totalPages + 1); i++) {
      pageNums.push(i);
    }

    return (
    <div style={{width:"100%", display:"flex", justifyContent:"center", gap:"12px"}}>
      {currentPage > 1 ? <span onClick={()=>updatePagination(currentPage - 1)} style={{cursor:"pointer", textDecoration:"underline"}}>{`<<`}</span> : null}
      <div> &nbsp;Page&nbsp;
        {
          startPageNum > 1 ?
          <span><span onClick={()=>updatePagination(1)} style={{cursor:"pointer"}}>1</span> {'... '}&nbsp;</span> : null
        }
        {
          pageNums.map(num => 
          <div key={num} style={{display:"inline"}}>
          <span onClick={()=>updatePagination(num)} style={{cursor:"pointer", textDecoration:num === currentPage ? "underline":"none"}}>{num}</span>
          &nbsp;&nbsp;
          </div>
        )
        }
        {
          currentPage <= totalPages - (Math.floor(pageChoices / 2) + 1) && totalPages > 9?
          <span>{'... '} <span onClick={()=>updatePagination(totalPages)} style={{cursor:"pointer"}}>{totalPages}&nbsp;</span></span> : null 
        }
      </div>
      {currentPage < totalPages ? <span onClick={()=>updatePagination(currentPage + 1)} style={{cursor:"pointer", textDecoration:"underline"}}>{`>>`}</span> : null}
    </div>
    );
  }

  const handleSearch = (e) => {
    e.preventDefault();
    let searchValue = "";
    if (e.target instanceof HTMLFormElement) {
      searchValue = new FormData(e.target).get("searchValue");
    } else {
      setSearchText("");
    }
    setCurrentPage(1);
    axios.get(`http://localhost:5000/transactions`, {
      params: {
        page: 1,
        per_page: 25,
        search: searchValue
      }
    }).then(response => {
      setTransactions(response.data.transactions);
      setTotalPages(response.data.total_pages);
    });
  };
  

  useEffect(() => {
    if (updatedCategory) {
      setTransactions(prev => prev.map(tx =>
        tx.category?.id === updatedCategory.id ?
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

  useEffect(() => {
    if (transactions.length > 0) {
      restoreScroll();
    }
  }, [transactions]);

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
      <form onSubmit={handleSearch}>
        <input type="text" style={{ padding:"6px", width:"300px" }} id="searchValue" name="searchValue" value={searchText} onChange={(e) => setSearchText(e.target.value)}/>
        <input type="submit" style={{ padding:"6px 8px", margin:"0 6px"}} value="Search"/>
        <button onClick={(e)=>{handleSearch(e);}} style={{ padding:"6px 8px"}}>Cancel</button>
      </form>
      <br />
      <br />
      <TransactionsIndex transactions={transactions} categories={categories} setCategories={setCategories} onEdit={handleTxEdit} 
                          setTransactions={setTransactions} setTxInPage={setTxInPage} saveScroll={saveScroll}/>
      <Modal onClose={handleClose} show={modalVisible}>
        <TransactionEdit onClose={handleClose} tx={currentTx} categories={categories} setCategories={setCategories} onUpdate={onUpdate} 
                          setUpdatedCategory={setUpdatedCategory} setUpdatedTransaction={setUpdatedTransaction} saveScroll={saveScroll}/>
      </Modal>
      <PageList />
    </main>
  );
}