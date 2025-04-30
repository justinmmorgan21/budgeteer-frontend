import { Link } from "react-router-dom";
export function Header() {
  return (
    <header>
      <nav>
        <Link to="/">Home</Link> | <Link to="/transactions">Transactions</Link> | <Link to="/categories">Categories</Link>
      </nav>
    </header>
  )
}