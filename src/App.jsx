import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./components/Home";
import { TransactionsPage } from "./components/TransactionsPage";
import { Footer } from "./components/Footer";
import axios from 'axios'

const router = createBrowserRouter([
  {
    element: (
      <div>
        <Header />
        <Outlet />
        <Footer />
      </div>
    ),
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/transactions",
        element: <TransactionsPage />,
        loader: async () => {
          const [transaction, category] = await Promise.all([
            axios.get("http://localhost:5000/transactions"),
            axios.get("http://localhost:5000/categories"),   
          ]);
          return { transactions: transaction.data, cat: category.data};
        }
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;