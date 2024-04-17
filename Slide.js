import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import { useParams } from "react-router-dom";
import axios from "axios";
import config1 from "./config";



const Slide = () => {
  const [data, setData] = useState([]);
  const { id } = useParams();
  const config = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
    },
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/cars/${id}?populate=*`
        );
        setData(response.data.data.attributes.imgslide);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
      <Carousel>
        {data.data?.map((item) => (
          <Carousel.Item key={item.id}>
            <img
              className="d-block w-100"
              src={config1.serverAdminPrefix + item?.attributes?.url}
              alt={`Slide `}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
};

export default Slide;
