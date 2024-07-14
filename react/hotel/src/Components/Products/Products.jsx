import { jwtDecode } from "jwt-decode";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";
import Add_Products from "../Add_Products/Add_Products";
import Edit_Products from "../Edit_Products/Edit_Products";
import axios from "axios";
import Swal from "sweetalert2";
import ramosshop from "./rm.png";
import Order from "../Order/Order";

function Products() {
  const [username, setUsername] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [activeNavItem, setActiveNavItem] = useState("หน้าหลัก");
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [isProceedToPaymentDisabled, setIsProceedToPaymentDisabled] =
    useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchMessage, setSearchMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.username);
    } else {
      navigate("/");
    }

    axios
      .get("http://localhost:3002/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleNavItemClick = (item) => {
    setActiveNavItem(item);
    setSelectedProducts(null);
  };

  const handleProductClick = (products) => {
    setSelectedProducts(products);
    setQuantity(1);
  };

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => Math.min(prevQuantity + 1, 20));
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Math.min(20, Number(e.target.value)));
    setQuantity(value);
  };

  const handleCheckboxChange = (index) => {
    setCartItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleBackClick = () => {
    setSelectedProducts(null);
    setShowCart(false);
  };

  const handleCartClick = () => {
    setShowCart(true);
  };

  const handleAddToCart = () => {
    const itemIndex = cartItems.findIndex(
      (item) => item.id === selectedProducts.id
    );

    if (itemIndex >= 0) {
      setCartItems((prevItems) =>
        prevItems.map((item, index) =>
          index === itemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      const itemToAdd = {
        id: selectedProducts.id,
        image: selectedProducts.image,
        name: selectedProducts.name,
        price: selectedProducts.price,
        quantity: quantity,
        checked: false,
      };
      setCartItems([...cartItems, itemToAdd]);
    }
  };

  const handleCartDecrementQuantity = (index) => {
    setCartItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  };

  const handleCartIncrementQuantity = (index) => {
    setCartItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.min(item.quantity + 1, 20) }
          : item
      )
    );
  };

  const calculateTotalItems = () => {
    const itemTypes = new Set(cartItems.map((item) => item.id));
    return itemTypes.size;
  };

  const handleRemoveFromCart = (index) => {
    setCartItems((prevItems) => prevItems.filter((item, i) => i !== index));
  };

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      if (item.checked) {
        return sum + item.price * item.quantity;
      }
      return sum;
    }, 0);
    setTotalPrice(total.toFixed(2));

    setIsProceedToPaymentDisabled(!cartItems.some((item) => item.checked));
  }, [cartItems]);

  const handleProceedToPayment = () => {
    const checkedItems = cartItems.filter((item) => item.checked);
    console.log("Checked Items:", checkedItems);
    if (checkedItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกสินค้า",
        text: "โปรดเลือกสินค้าก่อนดำเนินการชำระเงิน",
        confirmButtonText: "OK",
      });
      console.log(555);
    } else {
      navigate("/ptp", { state: { cartItems: checkedItems, totalPrice } });
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setSearchMessage("");
      return;
    }

    const results = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);

    if (results.length === 0) {
      setSearchMessage("ไม่พบสินค้า");
    } else {
      setSearchMessage("");
    }
  };

  return (
    <section className="products">
      <div id="pd-n">
        <div className="pd-i">
          <img className="pd-i1" src={ramosshop} alt="" />
        </div>

        <div className="pd-s1">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="fs-1"
          >
            <div className="pd-s2">
              <input
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="pd-s3"
                type="text"
                placeholder="ค้นหา"
              />
            </div>
            <div className="pd-s4">
              <a onClick={handleSearch} className="pd-s5">
                <svg
                  className="pd-s6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                </svg>
              </a>
            </div>
          </form>
        </div>

        <div className="pds-7">
          <a className="pds-8">
            <svg
              onClick={handleCartClick}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
            >
              <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
            </svg>
            {calculateTotalItems() > 0 && (
              <span className="pds-9">{calculateTotalItems()}</span>
            )}
          </a>
        </div>

        <div className="pdn-0" ref={dropdownRef}>
          <div className="pdn-1">
            <svg
              onClick={toggleDropdown}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z" />
            </svg>
          </div>
          <div className="pdn-2">
            <p>{username}</p>
          </div>

          {showDropdown && (
            <ul className="dropdown-menu">
              <li>
                <a onClick={handleLogout}>ออกจากระบบ</a>
              </li>
            </ul>
          )}
        </div>
      </div>

      <div id="pd-s">
        <nav>
          {["หน้าหลัก", "เพิ่มสินค้า", "แก้ไขสินค้า", "คำสั่งซื้อ"].map(
            (item) => (
              <a key={item} onClick={() => handleNavItemClick(item)}>
                <div className={activeNavItem === item ? "active" : ""}>
                  {item}
                </div>
              </a>
            )
          )}
        </nav>
      </div>

      <div id="pd-c">
        {activeNavItem === "หน้าหลัก" && (
          <div className="pdc-1">
            <div className="pdc-2">
              {(searchResults.length > 0 ? searchResults : products).map(
                (products) => (
                  <div
                    onClick={() => handleProductClick(products)}
                    className="pdc-3"
                    key={products.id}
                  >
                    <div className="pdc-4">
                      <img
                        className="pdc-4-1"
                        src={`http://localhost:3002/uploads/${products.image}`}
                      />
                    </div>
                    <div className="pdc-5">{products.name}</div>
                    <div className="pdc-6">฿{products.price}</div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
        {activeNavItem === "เพิ่มสินค้า" && <Add_Products />}
        {activeNavItem === "แก้ไขสินค้า" && <Edit_Products />}
        {activeNavItem === "คำสั่งซื้อ" && <Order />}
      </div>

      {selectedProducts && (
        <div className="pdc-7">
          <div className="pdc-8">
            <div className="pdc-9">
              <img
                className="pdc-9-1"
                src={`http://localhost:3002/uploads/${selectedProducts.image}`}
              />
            </div>
            <div className="pdc-10">
              <div className="pdc-11">{selectedProducts.name}</div>
              <div className="pdc-12">฿{selectedProducts.price}</div>
              <div className="pdc-13">
                จำนวนสินค้าคงเหลือ: {selectedProducts.quantity}
              </div>
              <div className="pdc-14">
                <h6 className="pdc-15">จำนวน:</h6>
                <div className="pdc-16">
                  <div onClick={decrementQuantity} className="pdc-17">
                    <svg
                      className="pdc-18"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
                    </svg>
                  </div>
                  <input
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="pdc-19"
                    min="1"
                    max="20"
                    type="text"
                  />
                  <div onClick={incrementQuantity} className="pdc-17">
                    <svg
                      className="pdc-18"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="pdc-21">
                <button className="bt1 p1dc-22" onClick={handleAddToCart}>
                  เพิ่มลงรถเข็น
                </button>
                <button className="bt1 p1dc-23" onClick={handleBackClick}>
                  กลับ
                </button>
              </div>
            </div>
          </div>

          <div className="pdc-20">{selectedProducts.description}</div>
        </div>
      )}

      {searchMessage && <div className="pdc-7"><div className="sc1">
        {searchMessage}</div></div>}

      {searchResults.length > 0 && (
        <div className="pdc-7">
          <div className="pdc-2 sc2">
          {searchResults.map((product) => (
            <div className="pdc-3" key={product.id}>
              <div className="pdc-4">
                <img className="pdc-4-1"
                  src={`http://localhost:3002/uploads/${product.image}`}
                  alt={product.name}
                />
              </div>
              <div className="pdc-5">{product.name}</div>
              <div className="pdc-6">฿{product.price}</div>
            </div>
          ))}
          </div>
        </div>
      )}

      {showCart && (
        <div className="pdc-7">
          <div className="cfp1">
            {cartItems.map((item, index) => (
              <div key={index} className="cfp2">
                <label className="cfp2-container">
                  <input
                    checked={item.checked}
                    onChange={() => handleCheckboxChange(index)}
                    type="checkbox"
                  />
                  <div className="cfp2-checkmark"></div>
                </label>
                <div className="cfp3">
                  <img
                    className="cfp3-1"
                    src={`http://localhost:3002/uploads/${item.image}`}
                  />
                </div>
                <div className="cfp4">
                  <div className="cfp5">{item.name}</div>
                  <div className="cfp6">฿{item.price}</div>
                </div>

                <div className="cfp8">
                  <div
                    onClick={() => handleCartDecrementQuantity(index)}
                    className="cfp9"
                  >
                    <svg
                      className="cfp10"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
                    </svg>
                  </div>
                  <input
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(e, index)}
                    className="cfp11"
                    min="1"
                    max="20"
                    type="text"
                  />
                  <div
                    onClick={() => handleCartIncrementQuantity(index)}
                    className="cfp9"
                  >
                    <svg
                      className="cfp10"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                    </svg>
                  </div>
                </div>
                <div className="cfp12">
                  <svg
                    onClick={() => handleRemoveFromCart(index)}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <div className="cfp7">
            <div className="cfp13">
              <div className="cfp14">ราคารวม</div>
              <div className="cfp15">฿{totalPrice}</div>
            </div>
            <button
              disabled={isProceedToPaymentDisabled}
              onClick={handleProceedToPayment}
              className="cfp16 bt1"
            >
              ดำเนินการชำระเงิน
            </button>
            <button className="cfp17" onClick={handleBackClick}>
              ยกเลิก
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Products;
