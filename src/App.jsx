import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Home } from "./Home";
import { TransactionsPage } from "./TransactionsPage";
import { Footer } from "./Footer";

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
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;