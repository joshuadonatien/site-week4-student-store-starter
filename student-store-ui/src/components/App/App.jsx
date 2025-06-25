import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import SubNavbar from "../SubNavbar/SubNavbar";
import Sidebar from "../Sidebar/Sidebar";
import Home from "../Home/Home";
import ProductDetail from "../ProductDetail/ProductDetail";
import NotFound from "../NotFound/NotFound";
import { removeFromCart, addToCart, getQuantityOfItemInCart, getTotalItemsInCart } from "../../utils/cart";
import "./App.css";

function App() {

  // State variables
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [userInfo, setUserInfo] = useState({
  name: "",
  student_id: "",
  dorm_number: "", // ✅ This must be included
  email: ""
});
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  // Toggles sidebar
  const toggleSidebar = () => setSidebarOpen((isOpen) => !isOpen);

  // Functions to change state (used for lifting state)
  const handleOnRemoveFromCart = (item) => setCart(removeFromCart(cart, item));
  const handleOnAddToCart = (item) => setCart(addToCart(cart, item));
  const handleGetItemQuantity = (item) => getQuantityOfItemInCart(cart, item);
  const handleGetTotalCartItems = () => getTotalItemsInCart(cart);

  const handleOnSearchInputChange = (event) => {
    setSearchInputValue(event.target.value);
  };
  
  const handleOnCheckout = async () => {

    console.log("Cart contents:", cart)
    try {
    setIsCheckingOut(true)
    setError(null)

    const { customer_name, dorm_number, student_id, email } = userInfo
    if (!customer_name || !dorm_number) {
      setError("Please fill out your name and dorm number.")
      setIsCheckingOut(false)
      return
    }
    console.log("Submitting order with:", { customer_name, dorm_number, student_id, email })


    // 1. Create the order
    const orderRes = await axios.post("http://localhost:3001/api/orders", {
      customer_name: customer_name,
      dorm_number,
      student_id,
      email
    })

    const orderId = orderRes.data.id
console.log("🧾 Cart contents being submitted:", cart)

for (const [productIdStr, quantity] of Object.entries(cart)) {
  const productId = parseInt(productIdStr)

  if (!productId || !quantity) {
    console.warn("❌ Skipping invalid cart item:", productIdStr, quantity)
    continue
  }

  await axios.post(`http://localhost:3001/api/orders/${orderId}/items`, {
    product_id: productId,
    quantity
  })

  console.log("✅ Added to order:", { product_id: productId, quantity })
}



    setOrder(orderRes.data)
    setCart({}) // ✅ Clear cart
    alert("Order successfully placed!")
  } catch (err) {
    console.error("Checkout error:", err)
    setError("Something went wrong during checkout.")
  } finally {
    setIsCheckingOut(false)
  }
  }

  useEffect(() => {
  setIsFetching(true)

  axios.get("http://localhost:3001/products")
    .then(res => {
      console.log("✅ Products fetched:", res.data)
      
      console.log(res.data.products[3].image_url);

      setProducts(res.data.products)
    })
    .catch(err => {
      console.error("❌ Error fetching products:", err)
      setError("Failed to fetch products.")
    })
    .finally(() => {
      setIsFetching(false)
    })
}, [])


  return (
    <div className="App">
      <BrowserRouter>
        <Sidebar
          cart={cart}
          error={error}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          isOpen={sidebarOpen}
          products={products}
          toggleSidebar={toggleSidebar}
          isCheckingOut={isCheckingOut}
          addToCart={handleOnAddToCart}
          removeFromCart={handleOnRemoveFromCart}
          getQuantityOfItemInCart={handleGetItemQuantity}
          getTotalItemsInCart={handleGetTotalCartItems}
          handleOnCheckout={handleOnCheckout}
          order={order}
          setOrder={setOrder}
        />
        <main>
          <SubNavbar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchInputValue={searchInputValue}
            handleOnSearchInputChange={handleOnSearchInputChange}
          />
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  error={error}
                  products={products}
                  isFetching={isFetching}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  addToCart={handleOnAddToCart}
                  searchInputValue={searchInputValue}
                  removeFromCart={handleOnRemoveFromCart}
                  getQuantityOfItemInCart={handleGetItemQuantity}
                />
              }
            />
            <Route
              path="/:productId"
              element={
                <ProductDetail
                  cart={cart}
                  error={error}
                  products={products}
                  addToCart={handleOnAddToCart}
                  removeFromCart={handleOnRemoveFromCart}
                  getQuantityOfItemInCart={handleGetItemQuantity}
                />
              }
            />
            <Route
              path="*"
              element={
                <NotFound
                  error={error}
                  products={products}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
 