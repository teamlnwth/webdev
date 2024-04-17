import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import "../CssAll/Public.css";
import AdcreateCar from "./AdcreateCar";
import Nav from "./Nav";
import Contact from "./Contact";
import config1 from "./config";


const AdminPage = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState([]);
  const config = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
    },
  };
  const fetchdata = () =>{
    axios
      .get("/cars?populate=*",config)
      .then(({ data }) => {
        console.log("data.data", data.data);
        const mapToset = data.data.map((e) => {
          return {
            key: e.id,
            id: e.id,
            ...e.attributes,
            imgcar: e.attributes.imgcar.data.attributes.url,
          };
        });
        setData(mapToset);
        setFilteredData(mapToset);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  useEffect(() => {
    fetchdata()
  }, []);


  useEffect(() => {
    console.log("data", data);
  }, [data]);

  const handleCarDetail = (id) => {
    navigate(`/AdDetailsPage/${id}`);
  };
  const GotoHistory = () => {
    navigate("/AdminHistory");
  };
  // getdatafromnav
  const handlesearch = (txt) => {
    const query = txt.trim().toLowerCase();
    if (query === "") {
      // If the search query is empty, reset filtered data to all data
      setFilteredData(data);
    } else {
      // Filter data based on search query
      const filtered = data.filter((item) =>
        item.namecar.toLowerCase().includes(query)
      );
      setFilteredData(filtered);
    }
  };

  return (
    <div>
      <Nav onSearch={handlesearch} />
      <div className="content">
        <Button
          className="bookingcar"
          variant="dark"
          onClick={() => GotoHistory()}
        >
          ประวัติรถที่เช่าทั้งหมด
        </Button>
        <AdcreateCar fetch={fetchdata} />
        <div className="container">
          <div className="products-con">
            {filteredData.map((item) => (
              <div className="products-item" key={item.id}>
                <div className="products-img">
                  <img
                    src={config1.serverAdminPrefix + item?.imgcar}
                    alt="Car Image"
                  ></img>
                </div>
                {/* <div className="car">
                <div className="namecar">{item.namecar}</div>
                <div className="pricecar"> {item.price}</div>
                <div className="pric2ecar"> บาท</div>
              </div> */}
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
      </div>

      <Contact />
    </div>
  );
};

export default AdminPage;
