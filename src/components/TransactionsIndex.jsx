import axios from 'axios';

export function TransactionsIndex({transactions, categories, setCategories, onEdit, setTransactions}) {

  const addCategory = async () => {
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

  const addTag = async (tx) => {
    const userInput = prompt("Please enter a new tag name for " + tx.category.name + ":", "tag name", tx.category.name);
    if (userInput !== null) {
      const params = new FormData();
      params.append('name', userInput);
      params.append('category_id', tx.category_id)
      try {
        const postResponse = await axios.post('http://localhost:5000/tags', params);
        return postResponse.data.id;
      } catch (error) {
        console.error("Error adding category:", error);
        return null;
      }
    } else {
      console.log("User cancelled the prompt.");
      return null;
    }
  }

  const handleCategorySelect = async (event, txId) => {
    event.preventDefault();
    const params = new FormData();
    let selection = event.target.value;
    if (selection === 'addCategory') {
      selection = await addCategory();
      if (!selection) {
        event.target.value = "";
        return;
      }
    }
    params.append("category", selection);
    axios.patch(`http://localhost:5000/transactions/${txId}`, params).then(response => {
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
  const handleTagSelect = async (event, tx) => {
    event.preventDefault();
    const params = new FormData();
    let selection = event.target.value;
    if (selection === 'addTag') {
      selection = await addTag(tx);
      if (!selection) {
        event.target.value = "";
        return
      }
    }
    params.append("tag", selection);
    axios.patch(`http://localhost:5000/transactions/${tx.id}`, params).then(response => {
      setTransactions(transactions.map(t => {
        return (t.id === tx.id)
          ? {
              ...t,
              tag_id: response.data.tag_id,
              tag: response.data.tag
            }
          : t;
      }));

      // Can't get a new tag to associate with the category so that when the edit button is chosen,
      // the tag reflects the new tag created above. Below was an attempt but did not work.

      // setCategories(categories.map(cat => {
      //   return (cat.id === tx.category_id)
      //   ? {
      //     ...cat,
      //     tags: [...cat.tags, response.data.tag]
      //   }
      //   :
      //   cat
      // }));
    })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate() + 1;
    const year = date.getFullYear();
    return month + "/" + day + "/" + year;
  }

  const TransactionItem = ({ t }) => (
    <div style={{border:"solid black 1px", padding:"10px", marginBottom:"8px", borderRadius:"5px"}}>
      <span style={{display: "inline-block", width:"140px"}}>{t.type}</span>
      <span style={{display: "inline-block", width:"130px"}}> {formatDate(t.date)}</span>
      <span style={{display: "inline-block", width:"100px"}}> {t.type==='DEPOSIT' ? `($${t.amount})` : `$${t.amount}`}</span>
      <span style={{display: "inline-block", width:"600px"}}> {t.payee}</span>
      {t.category ? 
        <span style={{display: "inline-block", width:"150px"}}>{t.category.name}</span>
        :
        (
          <div style={{display: "inline-block", width:"150px"}}>
            <select onChange={(event) => handleCategorySelect(event, t.id)} >
              <option></option>
              {categories?.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
              <option value="addCategory">+ add a Category</option>
            </select>
        </div>
        )
      }
      {t.tag ? 
        <span style={{display: "inline-block", width:"150px"}}>{t.tag.name}</span>
        :
        (t.category?
          <div style={{display: "inline-block", width:"150px"}}>
            <select onChange={(event) => handleTagSelect(event, t)} >
            <option></option>
              {t.category.tags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
              <option value="addTag">+ add a Tag</option>
            </select>
        </div>:null
        )
      }
      {t.category?
        <button onClick={() => {
          const latestTx = transactions.find(tr => tr.id === t.id);
          onEdit(latestTx);
        }}>edit</button>
      
        :
        null
      }
    </div>
  )

  return (
    <div>
      <div style={{ padding:"6px", fontWeight:"bold"}}>
        <span style={{display: "inline-block", width:"140px"}}>type</span>
        <span style={{display: "inline-block", width:"130px"}}>date</span>
        <span style={{display: "inline-block", width:"100px"}}>amount</span>
        <span style={{display: "inline-block", width:"600px"}}>payee</span>
        <span style={{display: "inline-block", width:"150px"}}>category</span>
        <span style={{display: "inline-block", width:"100px"}}>tag</span>
      </div>
      <div style={{width:"fit-content"}}>
        {transactions.map(t => (
          <TransactionItem key={t.id} t={t} />
        ))}
      </div>
    </div>
  );
}