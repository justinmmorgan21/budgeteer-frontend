import axios from 'axios'

export async function addCategory(setCategories) {
  const userInput = prompt("Please enter a new category name:", "category name");
  if (userInput !== null) {
    const params = new FormData();
    params.append('name', userInput);
    try {
      const postResponse = await axios.post('http://localhost:5000/categories', params);
      const newCategory = postResponse.data;

      const getResponse = await axios.get('http://localhost:5000/categories');
      setCategories(getResponse.data);

      return newCategory.id;
    } catch (error) {
      console.error("Error adding category:", error);
      return null;
    }
  } else {
    console.log("User cancelled the prompt.");
    return null;
  }
}

export async function addTag(tx, category, setCategory, setUpdatedCategory) {
  const userInput = prompt("Please enter a new tag name for " + tx.category.name + ":", "tag name", tx.category.name);
  if (userInput !== null) {
    const params = new FormData();
    params.append('name', userInput);
    params.append('category_id', tx.category_id)
    try {
      const postResponse = await axios.post('http://localhost:5000/tags', params);
      const newTag = postResponse.data;
      const getResponse = await axios.get('http://localhost:5000/categories');
      const newCategory = getResponse.data.find(cat => cat.id == category.id);
      setCategory(newCategory);
      setUpdatedCategory(newCategory);
      return newTag;
    } catch (error) {
      console.error("Error adding category:", error);
      return null;
    }
  } else {
    console.log("User cancelled the prompt.");
    return null;
  }
}