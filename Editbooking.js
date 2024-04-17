import React, { useEffect, useState } from "react";
import { Button, Spinner, Modal } from "react-bootstrap";
import "../CssAll/History.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const URL_BOOKING = "/bookings";

function Editbooking(props) {
  const booking = props.data;
  const setModal = props.setModal;
  const fetchData = props.fetchData
  const config = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
    },
  };

  //Event
  const admin_confirm = async (id) => {
    const response = await axios.put(`${URL_BOOKING}/${id}`, {
      data: { adminconfirm: true },
    },config);
    console.log(response);
    setModal(false);
    fetchData()
  };
  const admin_sendback = async (id) => {
    const response = await axios.put(`${URL_BOOKING}/${id}`, {
      data: { status: true },
    },config);
    console.log(response);
    setModal(false);
    fetchData()
  };
  const admin_un_sendback = async (id) => {
    const response = await axios.put(`${URL_BOOKING}/${id}`, {
      data: { status: false },
    },config);
    console.log(response);
    setModal(false);
    fetchData()
  };
  const cancelconfirm = async (id) => {
    const response = await axios.put(`${URL_BOOKING}/${id}`, {
      data: { adminconfirm: false },
    },config);
    console.log(response);
    setModal(false);
    fetchData()
  };
  useEffect(()=>{
    console.log('booking',booking)
  },[])

  return (
    <div>
      <div key={uuidv4()}>
        {/* ถ้ายังไม่ยืนยันจะแสดงปุ่มนี้ */}
        {booking.adminconfirm !== true && (
          <Button
            key={uuidv4()}
            variant="dark"
            onClick={() => admin_confirm(booking.id)}
          >
            ยืนยันการเช่า
          </Button>
        )}
        {/* ถ้ายืนยันแล้วจะแสดงปุ่มนี้ */}

        {booking.adminconfirm === true && (
          <Button
            key={uuidv4()}
            variant="secondary"
            onClick={() => cancelconfirm(booking.id)}
          >
            ยกเลิกยืนยันการเช่า
          </Button>
        )}

        {booking.adminconfirm === true && booking.status !== true && (
          <Button
            key={uuidv4()}
            variant="dark"
            onClick={() => admin_sendback(booking.id)}
            className="btn-marginleft"
          >
            คืนรถ
          </Button>
        )}
        {booking.adminconfirm === true && booking.status === true && (
          <Button
            key={uuidv4()}
            variant="secondary"
            onClick={() => admin_un_sendback(booking.id)}
            className="btn-marginleft"
          >
            ยกเลิกคืนรถ
          </Button>
        )}

        <Button
          variant="danger"
          className="btn-marginleft"
          onClick={() => setModal(false)}
        >
          ยกเลิก
        </Button>
      </div>
    </div>
  );
}

export default Editbooking;
