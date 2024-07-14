import { useState } from "react";
import axios from "axios";

function Qr_Prompay() {
  const [amount, setAmount] = useState("");
  const [qrCode, setQrCode] = useState("");

  const generateQrCode = async () => {
    try {
      const response = await axios.post("http://localhost:3002/generateQR", {
        amount,
      });
      setQrCode(response.data.Result);
    } catch (error) {
      console.error("Error generating QR code", error);
    }
  };

  return (
    <div>
      <h1>Generate PromptPay QR Code</h1>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={generateQrCode}>Generate QR Code</button>
      {qrCode && <img src={qrCode} alt="PromptPay QR Code" />}
    </div>
  );
}

export default Qr_Prompay;
