import { useEffect, useRef, useState } from "react";
import "./Cargo.css";

function Cargo() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <section className="cg1">
      <div className="cg2">
        <div className="cg3">
          <div id="cg1" ref={dropdownRef}>
            <a onClick={handleToggleDropdown}>บัญชีของ</a>
            {showDropdown && (
              <ul className="dropdown">
                <li>
                  <a href="#">ออกจากระบบ</a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="cg4">
        <div className="cg5">
          <div className="cg6">
            <img
              src="//laz-img-cdn.alicdn.com/images/ims-web/TB1KB2laMFY.1VjSZFnXXcFHXXa.png"
              alt="โลโก้ ลาซาด้า ช้อปออนไลน์"
            />
          </div>

          <div className="cg7">
            <div className="cg8">
              <form>
                <div className="cg9">
                  <div className="cg10">
                    <input className="cg11" type="text" placeholder="ค้นหา" />
                  </div>
                  <div className="cg12">
                    <a className="cg13">
                      <svg
                        className="cg14"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="cg15">
            <a href="">
              <svg
                className="cg16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
              >
                <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
              </svg>
              <span className="cg17">0</span>
            </a>
          </div>
        </div>
      </div>
      <div className="cg18">
        <div className="cg19">
          <div className="cg19">
            <div className="cg20">
              <a className="cg21" href="">
                <img
                  src="https://img.lazcdn.com/g/p/eaf7e9295da7e040ee76232e90216f32.jpg_400x400q80.jpg_.webp"
                  className="cg22"
                />
                <div className="cg23">
                  <div className="cg24">
                    A61 กางเกงขายาวลายสก็อต กางเกงขายาวผู้หญิง สไตล์เกาห cotton
                    ลี 9สี
                  </div>
                  <div className="cg25">
                    <div className="cg26">
                    <span className="cg27">฿</span>
                    <span className="cg28">39.00</span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
}

export default Cargo;
