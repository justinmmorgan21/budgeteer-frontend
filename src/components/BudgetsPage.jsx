import { BudgetsIndex } from "./BudgetsIndex";
import { BudgetModal } from "./BudgetModal";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { Modal } from "./Modal";
import axios from 'axios';

export function BudgetsPage() {
  const loadedCategories = useLoaderData();
  const [ categories, setCategories ] = useState(loadedCategories);
  const [ modalVisible, setModalVisible ] = useState(false);
  const [ currentCat, setCurrentCat ] = useState(null);
  const navigate = useNavigate();
  const [ startDate, setStartDate ] = useState();
  const [ endDate, setEndDate ] = useState();
  const [ isDateFormVisible, setIsDateFormVisible] = useState(false);

  const handleClose = () => {
    setModalVisible(false);
  }

  const handleCatEdit = (cat) => {
    setModalVisible(true);
    setCurrentCat(cat);
  }

  const onUpdate = (catName, newTags, archivedUpdate, budget) => {
    setCategories(prev => 
      prev.map(cat => {
        return cat.id === currentCat.id ? 
        {
          ...cat,
          name: catName,
          tags: newTags,
          archived: archivedUpdate || cat.archived,
          budget_amount: budget
        }
        : 
        cat
    }))
  }

  const addCategory = async () => {
    const userInput = prompt("Please enter a new category name:", "category name");
    if (userInput !== null) {
      const params = new FormData();
      params.append('name', userInput);
      try {
        await axios.post('http://localhost:5000/categories', params);
        const getResponse = await axios.get('http://localhost:5000/categories');
        setCategories(getResponse.data);
      } catch (error) {
        console.error("Error adding category:", error);
        return null;
      }
    } else {
      console.log("User cancelled the prompt.");
      return null;
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (e.target instanceof HTMLFormElement) {
      const params = new FormData(e.target);
      params.forEach((v,k)=>console.log(k, ": ", v))
      axios.get("http://localhost:5000/categories", {
        params: {
          startDate: params.get('startDate'),
          endDate: params.get('endDate')
        }
      }).then(response => setCategories(response.data))
    } else {
      setIsDateFormVisible(false);
      setStartDate("");
      setEndDate("");
      axios.get("http://localhost:5000/categories").then(response =>
        setCategories(response.data)
      )
    }
  };

  return (
    <main style={{width:"80%", margin:"20px auto"}}>
      <div style={{display:"flex", height:"fit-content", alignItems:"center"}}>
        <div style={{display:"flex", alignItems:"center", flex:"1 1 auto", gap:"48px"}}>
          <h1>All Budgets</h1>
          <button onClick={()=>addCategory()}>+ add a category</button>
          <button onClick={()=>setIsDateFormVisible(true)} style={{visibility:isDateFormVisible ? "hidden" : "visible"}}>Search custom dates</button>
          <form onSubmit={handleSearch} style={{visibility:!isDateFormVisible ? "hidden" : "visible"}}>
            <input type="date" name="startDate" onChange={(e)=>setStartDate(e.target.value)} value={startDate} />
            <span> to </span>
            <input type="date" name="endDate" onChange={(e)=>setEndDate(e.target.value)} value={endDate} />
            <input type="submit" style={{ padding:"6px 8px", margin:"0 6px"}} value="Select"/>
            <button onClick={(e)=>{handleSearch(e)}} style={{ padding:"6px 8px"}}>Cancel</button>
          </form>
        </div>
        <button onClick={()=>navigate('/archived')}>Archived {'>>>'}</button>
      </div>
      <BudgetsIndex categories={categories} setCategories={setCategories} onEdit={handleCatEdit}/>
      <Modal onClose={handleClose} show={modalVisible}>
        <BudgetModal onClose={handleClose} cat={currentCat} onUpdate={onUpdate}/>
      </Modal>
    </main>
  );
}