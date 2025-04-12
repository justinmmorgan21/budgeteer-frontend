export function TransactionsIndex(tx) {
  console.log("transaction index: ", tx)
  const transactions = tx.tx
  console.log("transactions: ", transactions)
  return (
    <div>
      <h1>All transactions</h1>
      <div>
        {transactions.map(t => (
          <div key={t.id}>
            <p>{t.payee}</p>
          </div>
        ))}
      </div>
    </div>
  );
}