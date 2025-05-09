import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./components/Home";
import { TransactionsPage } from "./components/TransactionsPage";
import { CategoriesPage } from "./components/CategoriesPage";
import { ArchivedPage } from "./components/ArchivedPage";
import { Footer } from "./components/Footer";
import axios from 'axios'

const router = createBrowserRouter([
  {
    element: (
      <div>
        <Header />
        <div style={{margin:"60px 0 90px 0"}}>
          <Outlet />
        </div>
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
          const [transactionData, category] = await Promise.all([
            axios.get(`http://localhost:5000/transactions?page=${1}&per_page=${25}`),
            axios.get("http://localhost:5000/categories"),   
          ]);
          return { transactionsData: transactionData.data, cat: category.data};
        }
      },
      {
        path: "/categories",
        element: <CategoriesPage />,
        loader: () => axios.get("http://localhost:5000/categories").then(response => response.data)
      },
      {
        path: "/archived",
        element: <ArchivedPage />,
        loader: () => axios.get("http://localhost:5000/archived").then(response => response.data)
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;