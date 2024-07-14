import { useState } from "react";
import "./Proceed_to_payment.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Proceed_to_payment() {
  const [selectedOption, setSelectedOption] = useState("");
  const localhost = useLocation();
  const navigate = useNavigate();
  const { cartItems, totalPrice } = localhost.state || {
    cartItems: [],
    totalPrice: 0,
  };
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    province: "",
    district: "",
    subdistrict: "",
    postalCode: "",
    phone: "",
  });

  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setShippingInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleCancel = () => {
    navigate("/products");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const orderData = {
      cartItems,
      totalPrice,
      shippingInfo,
      paymentMethod: selectedOption,
    };

    try {
      const response = await axios.post(
        "http://localhost:3002/orders",
        orderData
      );
      console.log(response.data);

      Swal.fire({
        title: "Order Successful!",
        text: "Your order has been placed successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(async () => {
        if (selectedOption === "qr") {
          try {
            const qrResponse = await axios.post(
              "http://localhost:3002/generateQR",
              { amount: totalPrice }
            );
            setQrCodeUrl(qrResponse.data.Result);
            setShowQRCode(true);
          } catch (qrError) {
            console.error("Error generating QR code!", qrError);
            Swal.fire({
              title: "Error!",
              text: "There was an error generating the QR code. Please try again.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        } else {
          navigate("/products");
        }
      });
    } catch (error) {
      console.error("There was an error creating the order!", error);

      Swal.fire({
        title: "Error!",
        text: "There was an error creating the order. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleCancelQR = () => {
    setShowQRCode(false);
  };

  return (
    <div className="pm1">
      {!showQRCode ? (
        <form onSubmit={handleSubmit} className="pm1-1">
          <div className="pm2">
            <h5>ที่อยู่ในการจัดส่ง</h5>
            <div className="pm3">
              <div className="pm3-1">
                <h6 className="pm4">ชื่อ-นามสกุล</h6>
                <div className="pm5">
                  <input
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    className="pm6"
                    type="text"
                    placeholder="ชื่อ-นามสกุล"
                  />
                </div>
              </div>
              <div className="pm3-1">
                <h6 className="pm4">ที่อยู่</h6>
                <div className="pm5">
                  <input
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    className="pm6"
                    type="text"
                    placeholder="ที่อยู่(บ้านเลขที่)"
                  />
                </div>
              </div>
              <div className="pm3-1">
                <h6 className="pm4">จังหวัด</h6>
                <div className="pm5">
                  <input
                    name="province"
                    value={shippingInfo.province}
                    onChange={handleInputChange}
                    className="pm6"
                    type="text"
                    placeholder="จังหวัด"
                  />
                </div>
              </div>
              <div className="pm3-1">
                <h6 className="pm4">อำเภอ</h6>
                <div className="pm5">
                  <input
                    name="district"
                    value={shippingInfo.district}
                    onChange={handleInputChange}
                    className="pm6"
                    type="text"
                    placeholder="อำเภอ"
                  />
                </div>
              </div>
              <div className="pm3-1">
                <h6 className="pm4">ตำบล</h6>
                <div className="pm5">
                  <input
                    name="subdistrict"
                    value={shippingInfo.subdistrict}
                    onChange={handleInputChange}
                    className="pm6"
                    type="text"
                    placeholder="ตำบล"
                  />
                </div>
              </div>
              <div className="pm3-1">
                <h6 className="pm4">รหัสไปรษณีย์</h6>
                <div className="pm5">
                  <input
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleInputChange}
                    className="pm6"
                    type="text"
                    placeholder="รหัสไปรษณีย์"
                  />
                </div>
              </div>
              <div className="pm3-1">
                <h6 className="pm4">เบอร์โทรศัพท์</h6>
                <div className="pm5">
                  <input
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    className="pm6"
                    type="text"
                    placeholder="เบอร์โทรศัพท์"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pm7">
            <div className="pm8">
              {cartItems.map((item, idex) => (
                <div key={idex} className="pm8-1">
                  <div className="pm8-2">
                    <img
                      className="pm8-6"
                      src={`http://localhost:3002/uploads/${item.image}`}
                    />
                  </div>
                  <div className="pm8-3">{item.name}</div>
                  <div className="pm8-4"> ฿{item.price}</div>
                  <div className="pm8-5">จำนวน: {item.quantity}</div>
                </div>
              ))}

              <div className="pm9">
                <h6 className="pm9-1">เลือกวิธีการชำระเงิน</h6>
                <div className="pm11">
                  <div
                    className={`pm9-4 ${
                      selectedOption === "cash" ? "checked" : ""
                    }`}
                  >
                    <label className="pm9-2">
                      <input
                        value="cash"
                        checked={selectedOption === "cash"}
                        onChange={handleRadioChange}
                        type="checkbox"
                        className="pm9-3"
                      />
                      <img
                        className="ipm1"
                        src="https://img.icons8.com/fluency/48/cash--v1.png"
                      />
                      ชำระเงินปลายทาง
                    </label>
                  </div>
                  <div
                    className={`pm9-4 ${
                      selectedOption === "qr" ? "checked" : ""
                    }`}
                  >
                    <label className="pm9-2">
                      <input
                        value="qr"
                        checked={selectedOption === "qr"}
                        onChange={handleRadioChange}
                        type="checkbox"
                        className="pm9-3"
                      />
                      <img
                        className="ipm1"
                        src="https://img.lazcdn.com/g/tps/imgextra/i2/O1CN01vsW6OA1Q2wx1hugZz_!!6000000001919-0-tps-278-278.jpg_2200x2200q75.jpg_.webp"
                      />
                      QR พร้อมเพย์
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="pm10">
              <div className="pm10-1">
                ราคารวม:<h6 className="pm10-2">฿{totalPrice}</h6>
              </div>
              <div className="pm10-3">
                <button type="submit" className="pm10-4">
                  สั้งซื้อ
                </button>
                <button onClick={handleCancel} className="pm10-5">
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="qr">
          <div className="qr1">
            <div className="qr2">
              <h3 className="qr3">QR พร้อมเพย์</h3>
              <div className="qr4">
                {qrCodeUrl && <img className="qr5" src={qrCodeUrl} />}
              </div>
            </div>
          </div>
          <div className="qr6">
            <button onClick={() => navigate("/products")} className="qr7 qr8">
              ชำระเงินเรียบร้อย
            </button>
            <button onClick={handleCancelQR} className="qr7 qr9">
              ยกเลิก
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Proceed_to_payment;
