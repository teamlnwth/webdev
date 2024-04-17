import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner, Button } from "react-bootstrap";
import Nav from "./Nav";
import axios from "axios";
import "../CssAll/Historydetail.css";
import "../CssAll/SuccessPayment.css";
import Contact from "./Contact";
import config1 from "./config";
const URL_CAR = "/cars";
const URL_BOOKING = "/bookings";

function SuccessfulPayment() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const config = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
    },
  };

  const fetchSuccessfulPayment = async () => {
    try {
      setIsLoading(true);

      //เอาข้อมูลbookingมา
      const [response] = await Promise.all([
        axios.get(`${URL_BOOKING}/${id}?populate=*`,config),
      ]);

      //มุดไปหาข้อมูลรูปภาพของid carที่response มา
      const findImg = await axios.get(
        `${URL_CAR}/${response.data.data.attributes.car.data.id}?populate=*`,config
      );

      const detailCar = response.data.data.attributes.car.data.attributes;

      const usedata = {
        key: response.data.data.id,
        id: response.data.data.id,
        ...response.data.data.attributes,
        detail: response.data.data.attributes.car.data.attributes.description,
        image: findImg.data.data.attributes.imgcar.data.attributes.url,
      };

      setData(usedata);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuccessfulPayment(); // corrected function call
  }, []);

  return (
    <div>
      {isLoading && (
        <div className="spinner-container">
          <Spinner animation="border" variant="secondary" />
        </div>
      )}
      <Nav />
      <div className="content">
        <div className="alert-success">
        <h1>คุณได้จองเรียบร้อยแล้ว!!</h1>
        </div>
        <div className="button-container">
            <Button variant="dark" onClick={() => navigate("/History")}>
              ไปหน้าประวัติการเช่ารถ
            </Button>
            <Button variant="dark" onClick={() => navigate("/")}>
              กลับหน้าหลัก
            </Button>
          </div>
        <div className="history-detail-container">
          <div className="history-detail-detail">
            <div className="success-payment">
              <h1>ชำระเงินเสร็จสิ้น</h1>
            </div>
            <h4 className="waiting">กรุณารอแอดมินตรวจสอบสลิปการโอน</h4>
            <h2>หมายเลขคำสั่งจอง : " {data.id} "</h2>
            <h5>รถ {data.detail}</h5>
            
            {data.startdate && data.enddate && (
              <h5>
                ระยะเวลาเช่าทั้งหมด{" "}
                {(new Date(data.enddate).getTime() -
                  new Date(data.startdate).getTime()) /
                  (1000 * 3600 * 24)}{" "}
                วัน
              </h5>
            )}
            <h5>ราคาทั้งหมด {data.Total} บาท</h5>
          </div>
          <div className="history-datail-image">
            <img src={config1.serverAdminPrefix + data?.image} alt="Car" />
          </div>
          
        </div>
      </div>

      <Contact />
    </div>
  );
}

export default SuccessfulPayment;
