import { Link } from "react-router-dom";
export function Header() {
  return (
    <header style={{border:"solid black 0px", margin:"0 -8px", width:"100%", position:"fixed", top:"0", zIndex:"100", background:"gray", padding:"12px"}}>
      <nav style={{width:"80%", margin:"0 auto", color:"white"}}>
        <Link style={{margin:"0 12px", color:"white"}} to="/">Home</Link> | 
        <Link style={{margin:"0 12px", color:"white"}} to="/transactions">Transactions</Link> | 
        <Link style={{margin:"0 12px", color:"white"}} to="/budgets">Budgets</Link>
      </nav>
    </header>
  )
}