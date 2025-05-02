import { CategoriesIndex } from "./CategoriesIndex";
import { CategoryEdit } from "./CategoryEdit";
import { useLoaderData } from "react-router-dom";
import { useState } from 'react';
import { Modal } from "./Modal";

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

  return (
    <main style={{width:"75%", margin:"20px auto"}}>
      <CategoriesIndex categories={categories} setCategories={setCategories} onEdit={handleCatEdit}/>
      <Modal onClose={handleClose} show={modalVisible}>
        <CategoryEdit onClose={handleClose} cat={currentCat} onUpdate={onUpdate}/>
      </Modal>
    </main>
  );
}