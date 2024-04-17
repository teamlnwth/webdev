import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import axios from "axios";
import { Button, Spinner, Modal } from "react-bootstrap";
import "../CssAll/History.css";
import Contact from "./Contact";
import config1 from "./config";
const URL_CAR = "/cars";
const URL_BOOKING = "/bookings";

function History() {
  const navigate = useNavigate();
  const [dataHistory, setDataHistory] = useState([]); // เก็บไว้อ่านเพื่อฟิลเตอร์
  const [dataforfilter, setDataforfilter] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const iduser = sessionStorage.getItem("iduser");
  const [showModal, setShowModal] = useState(false); // เพิ่ม state สำหรับจัดการการแสดง Modal
  const config = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
    },
  };

  const gotoHistoryDetail = (id) => {
    navigate(`/Historydetail/${id}`);
  };

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${URL_BOOKING}?populate=*`,config);
      console.log("response", response.data.data);
      const maptoSet = response.data.data.map(async (e) => {
        const find_img = await axios.get(
          `${URL_CAR}/${e.attributes.car.data.id}?populate=*`,config
        );

        console.log("find_img", find_img.data.data.attributes.imgcar.data);
        const img = find_img.data.data.attributes.imgcar.data.attributes.url;
        console.log(img);
        return {
          id: e.id,
          key: e.id,
          image: img,
          ...e.attributes,
        };
      });

      const alldata = await Promise.all(maptoSet);
      const filter = alldata.filter((e) => {
        //เอาแค่user id ที่ลอกอินอยู่
        return e.user.data.id === parseInt(iduser);
      });
      console.log("filter", filter);
      setDataHistory(filter); // เซ็ตข้อมูลที่จะใชช้ฟิลเตอในอนาคต
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteradminnotconfirm = () => {
    const notconfirm = dataHistory.filter((e) => {
      return e.adminconfirm !== true;
    });
    console.log("nc", notconfirm);
    setDataforfilter(notconfirm);
  };

  const filteradminconfirm = () => {
    const confirm = dataHistory.filter((e) => {
      return e.adminconfirm === true;
    });
    console.log("nc", confirm);
    setDataforfilter(confirm);
  };

  const allpurchase = () => {
    setDataforfilter(dataHistory);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    //เตรียมข้อมูลเสร็จเรียบร้อยมาหาว่าอันไหนรอคอนเฟิมเพื่อแสดงผล
    console.log("datahistory", dataHistory);
    console.log("iduser", iduser);
    const notconfirm = dataHistory.filter((e) => {
      //ตอนโหลดมาครั้งแรกเซตเป็นยังไม่คอนเฟิมเอาไว้
      return e.adminconfirm !== true;
    });
    console.log("nc", notconfirm);
    setDataforfilter(notconfirm);
  }, [dataHistory]);

  return (
    <div>
      {isLoading && (
        <div className="spinner-container">
          <Spinner animation="border" variant="secondary" />
        </div>
      )}
      <Nav />
      <div className="content">
        <div className="Topmenu">
          <div className="backmenu">
            <button className="buttonback" onClick={() => navigate("/")}>
              <img src="/back.png" />
            </button>
          </div>
          <div className="filtermenu">
            <Button variant="light" onClick={filteradminnotconfirm}>
              รอการยืนยัน
            </Button>
            <Button variant="primary" onClick={filteradminconfirm}>
              ยืนยันแล้ว
            </Button>
            <Button variant="dark" onClick={allpurchase}>
              การเช่าทั้งหมด
            </Button>
          </div>
        </div>

        <div className="containerHTR">
          <h1>ประวัติการเช่าของฉัน</h1>
          {dataforfilter.map((booking) => (
            <div
              key={booking.id}
              className="container-Booking"
            //onClick={() => setShowModal(true)}
            >
              <div className="booking-img">
                <img
                  src={config1.serverAdminPrefix + booking?.image}
                  alt="Car Image"
                ></img>
                <div className="adminconfirm">
                  สถานะการเช่า :{" "}
                  {booking.adminconfirm === true ? (
                    <p className="confirm">ยืนยันแล้ว</p>
                  ) : (
                    <p className="notconfirm">รอการยืนยัน</p>
                  )}
                </div>
              </div>
              <div className="booking-detail">
                <p>หมายเลข : {booking.id}</p>
                <p>ยี่ห้อ - รุ่น : {booking.car.data.attributes.namecar}</p>
                <p>วันที่เริ่มจอง : {booking.startdate}</p>
                <p>วันคืนรถ: {booking.enddate}</p>
                <p>
                  สถานที่รับรถ :{" "}
                  <a href="https://maps.app.goo.gl/ymMhmqjas8LMjVtf8">
                    เปิดในเเมพ
                  </a>
                </p>
                <div className="status">
                  สถานะ :{" "}
                  {booking.status === false ? (
                    <p className="notReturn">ยังไม่คืน</p>
                  ) : (
                    <p className="Return">คืนแล้ว</p>
                  )}
                </div>
                <div>
                  {booking.adminconfirm === true && (
                    <Button
                      className="review-btn"
                      variant="dark"
                      onClick={() => gotoHistoryDetail(booking.id)}
                    >
                      รีวิวรถคันนี้
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="text-white">รายละเอียดการเช่า</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modal-login">
              <img className="alert" src="/alert.png" />
              <p>ไม่พบบัญชีกรุณาเข้าสู่ระบบนะครับ</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="dark" onClick={() => navigate("/LoginForm")}>
              เข้าสู่ระบบ
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              ปิด
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <Contact />
    </div>
  );
}

export default History;
