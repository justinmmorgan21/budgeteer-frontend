import { Link } from "react-router-dom";
export function Header() {
  return (
    <header>
      <nav style={{border:"solid black 0px", width:"80%", margin:"0 auto"}}>
        <Link style={{margin:"0 12px"}} to="/">Home</Link> | <Link style={{margin:"0 12px"}} to="/transactions">Transactions</Link> | <Link style={{margin:"0 12px"}} to="/categories">Categories</Link>
      </nav>
    </header>
  )
}