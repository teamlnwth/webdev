import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner, Button, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../CssAll/Public.css";
import Nav from "./Nav";
import Contact from "./Contact";
import config1 from "./config";

axios.defaults.baseURL = config1.serverUrlPrefix;

const PublicPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [maxPrice, setMaxPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const role = sessionStorage.getItem("role");
  const config = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
    },
  };

  const navigate = useNavigate();

  //ดึงข้อมูลและแมพเอาไว้ใช้ง่ายๆ
  const fetchdata = () => {
    setIsLoading(true);
    axios
      .get("/cars?populate=*")
      .then(({ data }) => {
        const mapToset = data.data.map((e) => {
          return {
            key: e.id,
            id: e.id,
            ...e.attributes,
            imgcar: e.attributes.imgcar.data.attributes.url,
          };
        });
        setData(mapToset);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchdata();
  }, []);

  const handlePriceFilter = () => {
    let apiUrl = "/cars?populate=*";
    if (minPrice !== "") {
      apiUrl += `&filters[price][$gte]=${minPrice}`;
    }
    if (maxPrice !== "") {
      apiUrl += `&filters[price][$lte]=${maxPrice}`;
    }
    axios
      .get(apiUrl)
      .then(({ data }) => {
        const mapToset = data.data.map((e) => {
          return {
            key: e.id,
            id: e.id,
            ...e.attributes,
            imgcar: e.attributes.imgcar.data.attributes.url,
          };
        });
        setData(mapToset);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleCarDetail = (id) => {
    navigate(`/DetailsPage/${id}`);
  };

  const gotologin = () => {
    navigate("/LoginForm");
  };

  const goHistory = () => {
    role === null ? setShowModal(true) : navigate("/History");
  };

  const handleSearch = (txt) => {
    const query = txt.trim().toLowerCase();
    if (query === "") {
      // If the search query is empty, reset filtered data to all data
      fetchdata();
    } else {
      // Filter data based on search query
      const filtered = data.filter((item) =>
        item.namecar.toLowerCase().includes(query)
      );
      setData(filtered);
    }
  };

  return (
    <div>
      {isLoading && (
        <div className="spinner-container">
          <Spinner animation="border" variant="secondary" />
        </div>
      )}
      <Nav onSearch={handleSearch} />
      <div className="content">
        <div className="price-filter">
          <div className="item-infilter">ราคาต่ำสุด: </div>
          <input
            type="text"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="item-infilter"
          />
          <div className="item-infilter">ราคาสูงสุด: </div>
          <input
            type="text"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="item-infilter"
          />
          <Button onClick={handlePriceFilter} className="btn-infilter">
            คัดกรอง
          </Button>
        </div>

        <Button
          className="bookingcar"
          variant="dark"
          onClick={() => goHistory()}
        >
          ประวัติการเช่าของฉัน
        </Button>
        <div className="container">
          <div className="products-con">
            {data.map((item) => (
              <div className="products-item" key={item.id}>
                <div className="products-img">
                  <img
                    src={config1.serverAdminPrefix + item?.imgcar}
                    alt="Car Image"
                  ></img>
                </div>
                <div className="name_price">
                  <p>{item.namecar}</p>
                  <p>{item.price} บาท</p>
                </div>
                <div className="Bcar">
                  <Button
                    variant="dark"
                    onClick={() => handleCarDetail(item.id)}
                  >
                    ดูรายละเอียดรถ
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>ต้องเข้าสู่ระบบ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modal-login">
              <img className="alert" src="/alert.png" alt="Alert" />
              <p>ไม่พบบัญชีกรุณาเข้าสู่ระบบนะครับ</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="dark" onClick={() => gotologin()}>
              เข้าสู่ระบบ
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              ปิด
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <Contact></Contact>
    </div>
  );
};

export default PublicPage;
