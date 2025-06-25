import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NotFound from "../NotFound/NotFound";
import { formatPrice } from "../../utils/format";
import "./ProductDetail.css";

function ProductDetail({ addToCart, removeFromCart, getQuantityOfItemInCart }) {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // ✅ 1. Modal state

  useEffect(() => {
    console.log("Fetching product with ID:", productId);
    const fetchProduct = async () => {
      try {
        setIsFetching(true);
        const res = await axios.get(`http://localhost:3001/products/${productId}`);
        setProduct(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsFetching(false);
      }
    };
    console.log("isFetching:", isFetching, "product:", product);

    fetchProduct();
  }, [productId]);

  const toggleModal = () => setShowModal(!showModal); // ✅ 2. Toggle function

  if (error) return <NotFound />;
  if (isFetching || !product) return <h1>Loading...</h1>;

  const quantity = getQuantityOfItemInCart(product);

  const handleAddToCart = () => {
    if (product.id) addToCart(product);
  };

  const handleRemoveFromCart = () => {
    if (product.id) removeFromCart(product);
  };

  return (
    <div className="ProductDetail">
      <div className="product-card">
        <div className="media" onClick={toggleModal} style={{ cursor: "pointer" }}>
          <img src={product.image_url || "/placeholder.png"} alt={product.name} />
        </div>

        <div className="product-info">
          <p className="product-name">{product.name}</p>
          <p className="product-price">{formatPrice(product.price)}</p>
          <p className="description">{product.description}</p>
          <div className="actions">
            <button onClick={handleAddToCart}>Add to Cart</button>
            {quantity > 0 && <button onClick={handleRemoveFromCart}>Remove from Cart</button>}
            {quantity > 0 && <span className="quantity">Quantity: {quantity}</span>}
          </div>
        </div>
      </div>

      {/* ✅ 3. Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={product.image_url || "/placeholder.png"} alt={product.name} />
            <button className="close-button" onClick={toggleModal}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
