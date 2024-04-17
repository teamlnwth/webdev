import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Modal } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import "../CssAll/DetailsPage.css";
import Nav from "./Nav";
import Contact from "./Contact";
import Slide from "./Slide";
import StarRatings from "react-star-ratings";
import config1 from "./config";
import Breadcrumb from "react-bootstrap/Breadcrumb";
const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dataComment, setDataComment] = useState([]);
  const [datastarAVG, setDatastarAVG] = useState();

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);

  const role = sessionStorage.getItem("role");
  const user = sessionStorage.getItem("username");
  const config = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
    },
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`/cars/${id}?populate=*`);
      const e = response.data.data;
      const map_toset = {
        key: e.id,
        id: e.id,
        ...e.attributes,
        image: e.attributes.imgcar.data.attributes.url,
      };

      setData(map_toset);
      const responU = await axios.get(
        `/cars/${id}?populate=bookings.user.username`
      );
      const maptouse = responU.data.data?.attributes?.bookings?.data.map(
        (e) => {
          return {
            key: e.id,
            id: e.id,
            ...e.attributes,
            commenter: e.attributes.user.data.attributes.username,
          };
        }
      );
      setDataComment(maptouse);
      const ratings = responU.data.data.attributes?.bookings?.data
        .map((d) => d?.attributes?.rating)
        .filter((rating) => rating > 0);

      const averageRating =
        ratings.length === 0
          ? 0
          : ratings.reduce((sum, rating) => sum + rating, 0) / ratings?.length;

      setDatastarAVG(averageRating);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const Comfirmcar = () => {
    sessionStorage.setItem("wrap", `/Comfirmcar1/${id}`);
    role === null ? setShowModal(true) : navigate(`/Comfirmcar1/${id}`);
  };

  return (
    <div>
      <Nav />
      <div className="content">
        <div className="backmenu">
          <button className="buttonback" onClick={() => navigate("/")}>
            <img src="/back.png" />
          </button>
          <Breadcrumb>
            <Breadcrumb.Item href="/">หน้าหลัก</Breadcrumb.Item>
            <Breadcrumb.Item active>รายละเอียด</Breadcrumb.Item>
            <Breadcrumb.Item active style={{ color: "lightgray" }}>
              เลือกช่วงเวลา
            </Breadcrumb.Item>
            <Breadcrumb.Item active style={{ color: "lightgray" }}>
              ชำระเงิน
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <Container className="detialpage">
          <div className="layoutobj">
            <div className="layout1">
              <div>รายละเอียดรถ</div>
              <div>รุ่นรถ - ยี่ห้อ : {data.namecar}</div>
              <div>
                รายละเอียดของรถคันนี้ :{" "}
                <Button onClick={() => setShowModal1(true)}>ตำหนิ</Button>
                <div className="enginedetail" style={{ fontSize: "19px" }}>
                  {data.description}
                </div>
              </div>
            </div>
            <div className="layout2">
              <div className="detialcar">
                <img src={config1.serverAdminPrefix + data.image}></img>
              </div>

              <div>ราคาเช่าต่อวัน : {data.price} บาท/วัน</div>

              <Button className="cheakcar" variant="dark" onClick={Comfirmcar}>
                เช่ารถ
              </Button>
            </div>
          </div>
          <div>
            <div className="headcomment">
              ความคิดเห็น :{" "}
              <StarRatings
                rating={datastarAVG}
                starRatedColor="#ffb400"
                starHoverColor="#f9c74f"
                numberOfStars={5}
                name="rating"
                starDimension="40px"
                starSpacing="5px"
              />
            </div>
            <div className="comment-wrapper">
              {dataComment.map(
                (booking) =>
                  booking.comment !== null && (
                    <div className="insCom" key={booking.id}>
                      <StarRatings
                        rating={booking.rating}
                        starRatedColor="#ffb400"
                        numberOfStars={5}
                        name="rating"
                        starDimension="30px"
                        starSpacing="1px"
                      />
                      <p>{`${booking.commenter} : ${booking.comment}`}</p>
                    </div>
                  )
              )}
            </div>
          </div>
        </Container>
        <Contact></Contact>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>ต้องเข้าสู่ระบบ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modal-login">
              <img className="alert" src="/alert.png" />
              <p>ไม่พบบัญชีกรุณาเข้าสู่ระบบนะครับ</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="dark" onClick={() => navigate("/LoginForm")}>
              Login
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              ปิด
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showModal1} onHide={() => setShowModal1(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>ตำหนิบนรถ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modal-login">
              <Slide id={id} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal1(false)}>
              ปิด
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default DetailsPage;
