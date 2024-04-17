import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Modal, Form, Row } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import "../CssAll/DetailsPage.css";
import Nav from "./Nav";
import DeletePage from "./DeletePage";
import AdEditeCar from "./AdEditeCar";
import Contact from "./Contact";
import StarRatings from "react-star-ratings";
import config1 from "./config";

const AdDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  const [dataComment, setDataComment] = useState([]);
  const [datastarAVG, setDatastarAVG] = useState();

  const config = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
    },
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`/cars/${id}?populate=*`,config);
      console.log("response.data.data", response.data.data);
      const e = response.data.data;
      const map_toset = {
        key: e.id,
        id: e.id,
        ...e.attributes,
        image: e.attributes.imgcar.data.attributes.url,
      };

      setData(map_toset);
      const responU = await axios.get( //response สำหรับหาคอมเมนต์และคนเม้นและดาวไปใช้
        `/cars/${id}?populate=bookings.user.username`
      );//ยิงไปดูว่ารถนี้มีbookingอะไรบ้างที่เชื่อมอยู่
      console.log(
        "responU.data.data",
        responU.data.data?.attributes?.bookings?.data
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
        .map((d) => d.attributes.rating)//เอามาแค่ดาวที่ให้
        .filter((rating) => rating > 0);
      console.log("ratings", ratings);

      const averageRating =
          ratings.length === 0
            ? 0
            : ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;//หาดาวเฉลี่ย

      setDatastarAVG(averageRating);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    console.log("data", data);
    console.log("dataComment", dataComment);
    console.log("datastaraverage", datastarAVG);
  }, [data]);

  return (
    <div>
      <Nav />
      <div className="content">
        <button className="buttonback" onClick={() => navigate("/AdminPage")}>
          <img src="/back.png" />
        </button>
        <Container className="detialpage">
          <div className="layoutobj">
            <div className="layout1">
              <div>รายละเอียดรถ</div>
              <div>
                รุ่นรถ - ยี่ห้อ : {data.namecar}
              </div>
              <div>
                รายละเอียดของรถคันนี้ :
                <div className="enginedetail" style={{ fontSize: "19px" }}>
                  {data.description}
                </div>
              </div>
              
              
            </div>
            <div className="layout2">
              <div className="detialcar">
                <img
                  src={
                    config1.serverAdminPrefix +
                    data.image
                  }
                ></img>
              </div>
              <div>
                จำนวนที่เหลือ :{ data.remaining}{" "}
                คัน
              </div>
              <div>
                ราคาเช่าต่อวัน : {data.price}{" "}
                บาท/วัน
              </div>
              <div className="editcarmenu">
              <AdEditeCar fetchData={fetchData} className="cheakcar" id={id} />
              <DeletePage className="cheakcar" id={id} />
              </div>
        
            </div>
          </div>
        </Container>
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
              />{" "}
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
      <Contact />
    </div>
  );
};

export default AdDetailsPage;
