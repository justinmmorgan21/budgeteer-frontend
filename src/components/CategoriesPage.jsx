import { CategoriesIndex } from "./CategoriesIndex";
import { CategoryEdit } from "./CategoryEdit";
import { useLoaderData } from "react-router-dom";
import { useState } from 'react';
import { Modal } from "./Modal";
import axios from 'axios';

export function CategoriesPage() {
  const loadedCategories = useLoaderData();
  const [ categories, setCategories ] = useState(loadedCategories);
  const [ modalVisible, setModalVisible ] = useState(false);
  const [ currentCat, setCurrentCat ] = useState(null);

  const handleClose = () => {
    setModalVisible(false);
  }

  const handleCatEdit = (cat) => {
    setModalVisible(true);
    setCurrentCat(cat);
  }

  const onUpdate = (catName, newTags) => {
    setCategories(prev => 
      prev.map(cat => {
        return cat.id === currentCat.id ? 
        {
          ...cat,
          name: catName,
          tags: newTags
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

  return (
    <main style={{width:"80%", margin:"20px auto"}}>
      <div style={{display:"flex", height:"fit-content", alignItems:"center"}}>
        <h1>All categories</h1>
        <button onClick={()=>addCategory()} style={{height:"fit-content", marginLeft:"48px"}}>+ add a category</button>
      </div>
      <CategoriesIndex categories={categories} setCategories={setCategories} onEdit={handleCatEdit}/>
      <Modal onClose={handleClose} show={modalVisible}>
        <CategoryEdit onClose={handleClose} cat={currentCat} onUpdate={onUpdate}/>
      </Modal>
    </main>
  );
}