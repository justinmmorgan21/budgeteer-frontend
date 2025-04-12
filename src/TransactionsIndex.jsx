export function TransactionsIndex(tx) {
  console.log("transaction index: ", tx)
  const transactions = tx.tx
  console.log("transactions: ", transactions)
  return (
    <div>
      <h1>All transactions</h1>
      <div>
        {transactions.map(t => (
          <div key={t.id} style={{border:"solid black 1px", padding:"6px"}}>
            <span style={{display: "inline-block", width:"140px"}}>{t.type}</span> 
            <span style={{display: "inline-block", width:"100px"}}> {t.date}</span>
            <span style={{display: "inline-block", width:"100px"}}> ${t.amount}</span> 
            <span> {t.payee}</span>
          </div>
        ))}
      </div>
    </div>
  );
}