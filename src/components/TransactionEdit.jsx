import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import apiConfig from "../apiConfig";

export function TransactionEdit( { onClose, tx, categories, setCategories, onUpdate } ) {
  const [payee, setPayee] = useState(tx.payee);
  const [category, setCategory] = useState(tx.category);
  const [tag, setTag] = useState(tx.tag);

  const navigate = useNavigate();

  // const initializeParams = event => {
  //   let params = new FormData(event.target);
  //   days.forEach( day => {
  //     if (!params.has(day)) {
  //       params.append(day, false);
  //     }
  //   })
  //   if (!params.has("one_timer")) {
  //     params.append("one_timer", false);
  //   }
  //   params.append("title", chore.title);
  //   return params;
  // }

  // const handleSubmit = event => {
  //   event.preventDefault();
  //   let params = initializeParams(event);

    // axios.get(`${apiConfig.backendBaseUrl}/chores.json`).then((response) => {
    //   const chores = response.data;
    //   let matchesAny = false;
    //   chores.map( oneChore => {
    //     let matches = true;
    //     if (oneChore.id == chore.id) matches = false;
    //     if (oneChore.title != params.get("title")) matches = false;
    //     if (oneChore.description != params.get("description")) matches = false;
    //     days.forEach( day => {
    //       if ((oneChore[day] != null && oneChore[day] != (params.get(day) === "on" ? true : false)) || (oneChore[day] == null && params.get(day) != "false")) {
    //         matches = false;
    //       }
    //     })
    //     if (oneChore.one_timer != (params.get("one_timer") === "on" ? true : false)) matches = false;        
    //     if (oneChore.points_awarded != params.get("points_awarded")) matches = false;
    //     if (matches) {
    //       matchesAny = true;
    //       // if all checked children stay checked - change child_chores to other chore for each and delete chore
    //       // otherwise...
    //       // // if was not checked is now checked: make new child_chore for other chore
    //             // if ONLY no checked to checked, delete chore
    //       // // if was checked and is now not checked: deactivate child_chore for THAT Child

    //       // while looping through each parent's child:  also track if any go from checked to not checked, then switch boolean
    //       let checkedToUnchecked = false;
    //       currentParent.children.forEach( (oneChild, i) => {
    //         params = initializeParams(event);
    //         // checked to checked -> update child_chore (new chore_id)
    //         if (chore.children.find(child => child.id === oneChild.id) && isChildChecked[oneChild.id]) {
    //           params.append("new_chore_id", oneChore.id);
    //           axios.patch(`${apiConfig.backendBaseUrl}/child_chores/${oneChild.id}/${chore.id}.json`, params).then(() => {
    //             if (currentParent.children.length - 1 === i && checkedToUnchecked) {
    //               onClose();
    //               navigate(`/chores`);
            //     }
            //   })
            // }
            // // unchecked to checked -> create child_chore (using child_id, chore_id)
            // else if (!chore.children.find(child => child.id === oneChild.id) && isChildChecked[oneChild.id]) {
            //   params.append("chore_id", oneChore.id);
            //   params.append("child_id", oneChild.id);
            //   axios.post(`${apiConfig.backendBaseUrl}/child_chores.json`, params).then(() => {
            //     if (currentParent.children.length - 1 === i && checkedToUnchecked) {
            //       onClose();
            //       navigate(`/chores`);
            //     }
            //   })
            // }
            // // checked to unchecked -> update child_chore (active:false, date_inactivated)
            // else if (chore.children.find(child => child.id === oneChild.id) && !isChildChecked[oneChild.id]) {
            //   checkedToUnchecked = true;
            //   params.append("active", false);
            //   params.append("date_inactivated", new Date());
            //   axios.patch(`${apiConfig.backendBaseUrl}/child_chores/${oneChild.id}/${chore.id}.json`, params).then(() => {
            //     if (currentParent.children.length - 1 === i) {
            //       onClose();
            //       navigate(`/chores`);
            //     }
            //   })
            // }
  //         })
  //         // if boolean says no checked to unchecked, delete old chore
  //         if (!checkedToUnchecked) {
  //           axios.delete(`${apiConfig.backendBaseUrl}/chores/${chore.id}.json`).then(() => {
  //             onClose();
  //             navigate(`/chores`);
  //           })
  //         }
  //       }
  //     })
  //     if (!matchesAny) {
  //       axios.patch(`${apiConfig.backendBaseUrl}/chores/${chore.id}.json`, params).then(() => {
  //         let axiosPromises = currentParent.children.map((oneChild) => {
  //           if (chore.children.find(child => child.id === oneChild.id) && !isChildChecked[oneChild.id]) {  // checked to unchecked
  //             params.append("active", false);
  //             params.append("date_inactivated", new Date());
  //             return axios.patch(`${apiConfig.backendBaseUrl}/child_chores/${oneChild.id}/${chore.id}.json`, params);
  //           }
  //           if (!chore.children.find(child => child.id === oneChild.id) && isChildChecked[oneChild.id]) {
  //             params.append("child_id", oneChild.id);
  //             params.append("chore_id", chore.id);
  //             return axios.post(`${apiConfig.backendBaseUrl}/child_chores.json`, params);
  //           }        
  //           return Promise.resolve();
  //         });
  //         Promise.all(axiosPromises).then(() => {
  //           onClose();
  //           navigate(`/chores`);
  //         }).catch((error) => {
  //           console.error("Error updating child chores:", error);
  //         });
  //       })
  //     }
  //   })
  // }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate() + 1;
    const year = date.getFullYear();
    return month + "/" + day + "/" + year;
  }

  const addCategory = async () => {
    const userInput = prompt("Please enter your input:", "enter a new category name");
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new FormData(event.target);
    params.forEach((value, key) => {
      console.log("key: ", key);
      console.log("value: ", value);
    })
    // console.log("tx: ", tx);
    axios.patch(`http://localhost:5000/transactions/${tx.id}`, params).then(response => {
      console.log(response.data);
      onUpdate(response.data);
      onClose();
      navigate(`/transactions`);
    })
  }

  const handleCategorySelect = async (event, txId) => {
    event.preventDefault();
    const params = new FormData();
    let selection = event.target.value;
    if (selection === 'addCategory') {
      selection = await addCategory();
      if (!selection) {
        event.target.value = category.id;
        return;
      }
    }
    params.append("category", selection);
    axios.patch(`http://localhost:5000/transactions/${txId}`, params).then(response => {
      console.log(response.data);
      setTransactions(transactions.map(t => {
        return (t.id === txId)  
        ? {
          ...t,
          category_id: response.data.category_id,
          category: response.data.category
        }
        : t;
      }));
    })
    
  }
  const handleTagSelect = (event, txId) => {
    event.preventDefault();
    console.log(event.target.value);
    console.log(txId);
    const params = new FormData();
    // params.append("tag", event.target.value);
    // axios.patch(`http://localhost:5000/transactions/${txId}`, params).then(response => {
    //   console.log(response.data);
    //   setTransactions(transactions.map(t => {
    //     return (t.id === txId)
    //       ? {
    //           ...t,
    //           tag_id: response.data.tag_id,
    //           tag: response.data.tag
    //         }
    //       : t;
    //   }));
    // })
  }

  return (
    <div>
        <span>{formatDate(tx.date)}</span>
      <h3>{payee}</h3>
      <br />
      <div style={{width:"50%", display:"flex", flexDirection:"row", justifyContent:"space-between", border:"0px solid black"}}>
        <span>{tx.type}</span>
        <span>${tx.amount}</span>
      </div>
      <hr />
        <div style={{ display:"inline"}}>
          <form onSubmit={handleSubmit} style={{  width:"fit-content", display:"inline"}}>
            <label htmlFor="categories"></label>
            <select onChange={e=>{
                if (e.target.value === "addCategory") {
                  e.target.value = addCategory();
                } else {
                  setCategory(categories.find(cat=>cat.id == e.target.value))
                }
              }} value={category.id} name="category">
              {categories?.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
              <option value="addCategory">+ add a Category</option>
            </select>
            <div style={{display: "inline-block"}}>
              <select onChange={e=>setTag(e.target.value)} value={tag.id} name="tag">
                {category?.tags.length > 0?
                  category.tags.map(tag => (
                    <option key={tag.id} value={tag.id}>{tag.name}</option>
                  ))
                :
                  <option value={""}>null2</option>
                }
                <option value="addTag">+ add a Tag</option>
              </select>
            </div>
            &nbsp;
          <input type="submit" value="update"/>
          </form>
        </div>
    </div>
  );
}