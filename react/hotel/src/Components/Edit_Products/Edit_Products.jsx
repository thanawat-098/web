import { useEffect, useState } from "react";
import "./Edit_Products.css";
import axios from "axios";
import Swal from "sweetalert2";

function Edit_Products() {
  const [product, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3002/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setPopupVisible(true);
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
    setSelectedProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct({ ...selectedProduct, [name]: value });
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3002/products/${selectedProduct.id}`,
        selectedProduct
      );
      setPopupVisible(false);

      const response = await axios.get("http://localhost:3002/products");
      setProducts(response.data);

      Swal.fire({
        icon: "success",
        title: "สำเร็จ!",
        text: "แก้ไขข้อมูลสินค้าเรียบร้อยแล้ว",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: `ไม่สามารถแก้ไขข้อมูลได้: ${error.message}`,
        confirmButtonText: "OK",
      });
    }
  };

  const handleDeleteClick = async (productId) => {
    try {
      await axios.delete(`http://localhost:3002/products/${productId}`)
      const response = await axios.get("http://localhost:3002/products")
      setProducts(response.data)
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  return (
    <div className="pdc-1">
      <div className="ed1">
        <table className="ed2">
          <thead className="ed3">
            <tr className="ed3-1">
              <th className="ed4 ed4-1">รูปสินค้า</th>
              <th className="ed4 ed4-2">ชื่อสินค้า</th>
              <th className="ed4 ed4-3">ราคาสินค้า</th>
              <th className="ed4 ed4-4">รายละเอียดสินค้า</th>
              <th className="ed4 ed4-5">จำนวนสินค้า</th>
              <th className="ed4 ed4-6">แก้ไข</th>
              <th className="ed4 ed4-7">ลบ</th>
            </tr>
          </thead>
          <tbody className="ed5">
            {product.map((product) => (
              <tr key={product.id}>
                <td className="ed6 ed5-1">
                  <img
                    className="ed7"
                    src={`http://localhost:3002/uploads/${product.image}`}
                  />
                </td>
                <td className="ed6 ed5-2">{product.name}</td>
                <td className="ed6 ed5-3">{product.price}</td>
                <td className="ed8 ed6 ed5-4">{product.description}</td>
                <td className="ed6 ed5-5">{product.quantity}</td>
                <td className="ed6 ed5-6">
                  <svg
                    onClick={() => handleEditClick(product)}
                    className="ed9"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                  >
                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V299.6l-94.7 94.7c-8.2 8.2-14 18.5-16.8 29.7l-15 60.1c-2.3 9.4-1.8 19 1.4 27.8H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z" />
                  </svg>
                </td>
                <td className="ed6 ed5-7">
                  <svg
                  onClick={() => handleDeleteClick(product.id)}
                    className="ed10"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
                  </svg>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {popupVisible && (
          <div className="popup">
            <div className="popup-i">
              <form className="popup-i1" onSubmit={handleSaveChanges}>
                <div className="pop-i1">
                  <div className="pop1">
                    <img
                      className="i-pop"
                      src={`http://localhost:3002/uploads/${selectedProduct.image}`}
                    />
                  </div>
                  <div className="pop2">
                    <div className="pop3">
                      <label className="pop3-1">ชื่อสินค้า:</label>
                      <input
                        className="pop3-2"
                        type="text"
                        name="name"
                        value={selectedProduct.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="pop3">
                      <label className="pop3-1">ราคาสินค้า:</label>
                      <input
                        className="pop3-2"
                        type="text"
                        name="price"
                        value={selectedProduct.price}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="pop3">
                      <label className="pop3-1">จำนวนสินค้า</label>
                      <input
                        className="pop3-2"
                        type="text"
                        name="quantity"
                        value={selectedProduct.quantity}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="pop4">
                  <label className="pop4-2">รายละเอียดสินค้า:</label>
                  <textarea
                    className="pop4-1"
                    name="description"
                    value={selectedProduct.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div className="pop5">
                  <button className="pop6" type="submit">
                    บันทึก
                  </button>
                  <button className="pop7" onClick={handlePopupClose}>
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Edit_Products;
