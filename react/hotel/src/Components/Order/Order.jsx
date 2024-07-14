import { useEffect, useState } from "react";
import "./Order.css";

function Order() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
      fetch("http://localhost:3002/orders")
        .then((response) => response.json())
        .then((data) => {
          const ordersMap = data.reduce((acc, item) => {
            if (!acc[item.orderId]) {
              acc[item.orderId] = {
                orderId: item.orderId,
                totalPrice: item.totalPrice,
                shippingInfo: {
                  fullName: item.fullName,
                  address: item.address,
                  province: item.province,
                  district: item.district,
                  subdistrict: item.subdistrict,
                  postalCode: item.postalCode,
                  phone: item.phone,
                },
                paymentMethod: item.paymentMethod,
                createdAt: item.created_at,
                items: [],
              };
            }
            acc[item.orderId].items.push({
              productId: item.productId,
              name: item.name,
              price: item.price,
              image: item.image,
              quantity: item.quantity,
            });
            return acc;
          }, {});
  
          const sortedOrders = Object.values(ordersMap).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setOrders(sortedOrders);
        })
        .catch((error) => console.error("Error fetching orders:", error));
    }, []);
  

  return (
    <div className="or">
      {orders.map((order) => (
        <div key={order.orderId} className="or1">
          <div className="or2">เลขorder: {order.orderId}</div>
          <div className="or3">
            {order.items.map((item) => (
              <div className="or3-1" key={item.productId}>
                <div className="or4">
                  <img src={`http://localhost:3002/uploads/${item.image}`} />
                </div>
                <div className="or5">{item.name}</div>
                <div className="or6">฿{item.price}</div>
                <div className="or6">จำนวน : {item.quantity}</div>
              </div>
            ))}
          </div>
          <div className="or7">ราคารวม: ฿{order.totalPrice}</div>
          <div className="or8">
            <h5>ที่อยู่ในการจัดส่ง</h5>
            <p>{order.shippingInfo.fullName}</p>
            <p>
              {order.shippingInfo.address}, {order.shippingInfo.subdistrict},{" "}
              {order.shippingInfo.district}, {order.shippingInfo.province},{" "}
              {order.shippingInfo.postalCode}
            </p>
            <p>โทร: {order.shippingInfo.phone}</p>
          </div>
          <div className="or8">
            วิธีชำระเงิน :
            {order.paymentMethod === "cash"
              ? "ชำระเงินปลายทาง"
              : order.paymentMethod === "qr"
              ? "QR พร้อมเพย์"
              : order.paymentMethod}
          </div>
          <div className="or8">วัน/เวลา: {new Date(order.createdAt).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}

export default Order;
