export function TransactionsIndex({transactions, categories}) {
  const handleSelect = (event) => {
    event.preventDefault();
    const params = new FormData(event.target);
    console.log(params);
    console.log(params.get("categories"));
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDay() + 1;
    const year = date.getFullYear();
    return month + "/" + day + "/" + year;
  }

  const TransactionItem = ({ t }) => (
    <div style={{border:"solid black 1px", padding:"6px"}}>
      <span style={{display: "inline-block", width:"140px"}}>{t.type}</span>
      <span style={{display: "inline-block", width:"150px"}}> {formatDate(t.date)}</span>
      <span style={{display: "inline-block", width:"100px"}}> ${t.amount}</span>
      <span style={{display: "inline-block", width:"600px"}}> {t.payee}</span>
      <form onSubmit={handleSelect} action="" style={{  width:"fit-content", display:"inline"}}>
        <label htmlFor="categories">Category: </label>
        <select name="categories" >
          {categories.map(category => (
            <option key={category.id} value={category.name}>{category.name}</option>
          ))}
        </select>
        &nbsp;
        <input type="submit" value="select"/>
      </form>
    </div>
  )

  return (
    <div>
      <h1>All transactions</h1>
      <div style={{ padding:"6px"}}>
        <span style={{display: "inline-block", width:"140px"}}>type</span>
        <span style={{display: "inline-block", width:"150px"}}>date</span>
        <span style={{display: "inline-block", width:"100px"}}>amount</span>
        <span style={{display: "inline-block", width:"600px"}}>payee</span>
        <span >category</span>
      </div>
      <div>
        {transactions.map(t => (
          <TransactionItem key={t.id} t={t} />
        ))}
      </div>
    </div>
  );
}