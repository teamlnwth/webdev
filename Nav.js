import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicNav from "./PublicNav";
import MemberNav from "./MemberNav";
import AdminNav from "./AdminNav";
import { useLocation } from "react-router-dom";
import axios from "axios";

function Nav(props) {
  // เรียกใช้ hook useLocation เพื่อเข้าถึงข้อมูลของ URL
  const location = useLocation();
  // ตรวจสอบว่าอยู่ที่หน้าโฮมหรือไม่
  const isHome = location.pathname === "/";
  const isHomeAD = location.pathname === "/AdminPage";
  useState(() => {
    console.log("ishome", isHome);
  }, []);
  // senddatatoPublicPage.js
  const NavtoPBP = (text) => {
    props.onSearch(text);
  };
  // senddatatoAdminPage.js
  const NavtoAMP = (text) => {
    props.onSearch(text);
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.removeItem("jwtToken");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("iduser");
    sessionStorage.removeItem("wrap");

    navigate("/");
  };
  const role = sessionStorage.getItem("role");
  return (
    <div>
      {!role && <PublicNav onSearch={NavtoPBP} onhome={isHome} />}
      {role === "Member" && (
        <MemberNav
          onlogout={handleLogout}
          onSearch={NavtoPBP}
          onhome={isHome}
        />
      )}
      {role === "Admin" && (
        <AdminNav
          onlogout={handleLogout}
          onSearch={NavtoAMP}
          onhome={isHomeAD}
          at={props.at}
        />
      )}
    </div>
  );
}

export default Nav;
