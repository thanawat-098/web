import axios from "axios";
import { useState } from "react";
import "./Add_Products.css";
import Swal from "sweetalert2";

function Add_Products() {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setProductImage(e.target.files[0]);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    if (
      !productName ||
      !productDescription ||
      !productPrice ||
      !productQuantity ||
      !productImage
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
        confirmButtonText: "OK",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", productDescription);
    formData.append("price", productPrice);
    formData.append("quantity", productQuantity);
    formData.append("image", productImage);

    try {
      setLoading(true);
      await axios.post("http://localhost:3002/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "เพิ่มสำเร็จแล้ว!",
        confirmButtonText: "OK",
      });
      setProductName("");
      setProductDescription("");
      setProductPrice("");
      setProductQuantity("");
      setProductImage(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      errorMessage;
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `There was an error uploading the product: ${errorMessage}`,
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="pdc-1">
      <form className="ap1" onSubmit={handleProductSubmit}>
        <div className="ap2">
          <label className="ap4">ชื่อสินค้า:</label>
          <input
            className="ap3"
            placeholder="ชื่อสินค้า"
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div className="ap5">
          <label className="ap4">รายละเอียดสินค้า:</label>
          <textarea
            className="ap6 ap3"
            placeholder="รายละเอียดสินค้า"
            type="text"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
        </div>
        <div className="ap7">
          <label className="ap4">ราคาสินค้า:</label>
          <input
            className="ap3"
            placeholder="ราคาสินค้า"
            type="text"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
          />
        </div>
        <div className="ap7">
          <label className="ap4">จำนวนสินค้า:</label>
          <input
            className="ap3"
            placeholder="จำนวนสินค้า"
            type="text"
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
          />
        </div>
        <div className="ap7">
          <label className="ap4">รูปสินค้า</label>
          <input className="ap8" type="file" onChange={handleFileChange} />
        </div>
        <div className="ap13">
          <button className="ap14 ap11" type="submit" disabled={loading}>
            {loading ? (
              "Loading.."
            ) : (
              <>
                <svg
                  className="svg-icon"
                  width="24"
                  viewBox="0 0 24 24"
                  height="24"
                  fill="none"
                >
                  <g
                    strokeWidth="2"
                    strokeLinecap="round"
                    stroke="#056dfa"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  >
                    <path d="m3 7h17c.5523 0 1 .44772 1 1v11c0 .5523-.4477 1-1 1h-16c-.55228 0-1-.4477-1-1z"></path>
                    <path d="m3 4.5c0-.27614.22386-.5.5-.5h6.29289c.13261 0 .25981.05268.35351.14645l2.8536 2.85355h-10z"></path>
                  </g>
                </svg>
                <span className="ap12">เพิ่มสินค้า</span>
              </>
            )}
          </button>

          <button type="reset" className="ap14 ap9">
            <svg
              className="svg-icon"
              fill="none"
              height="20"
              viewBox="0 0 20 20"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g stroke="#ff342b" strokeLinecap="round" strokeWidth="1.5">
                <path d="m3.33337 10.8333c0 3.6819 2.98477 6.6667 6.66663 6.6667 3.682 0 6.6667-2.9848 6.6667-6.6667 0-3.68188-2.9847-6.66664-6.6667-6.66664-1.29938 0-2.51191.37174-3.5371 1.01468"></path>
                <path d="m7.69867 1.58163-1.44987 3.28435c-.18587.42104.00478.91303.42582 1.0989l3.28438 1.44986"></path>
              </g>
            </svg>
            <span className="ap10">Repeat</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default Add_Products;
