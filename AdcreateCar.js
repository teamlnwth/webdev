import { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

const AdcreateCar = (props) => {
  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [carName, setCarName] = useState("");
  const [carDescription, setCarDescription] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [quantityLeft, setQuantityLeft] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [images, setImages] = useState(null);
  const config = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
    },
  };


  const handleImageChange = (event) => { //รูปรถ
    const file = event.target.files[0];
    setImageFile(file);
  };

  const handleslideImageChange = (event) => { //รูปสไลด์ตำหนิ
    const selectedImages = Array.from(event.target.files);
    setImages(selectedImages);
    console.log(event.target.files);
  };
  console.log(imageFile);

  const handlecarName = (event) => { //ชื่อรถ
    setCarName(event.target.value);
  };

  const handlecarDescription = (event) => { //รายละเอียดรถ
    setCarDescription(event.target.value);
  };

  const handlecarPrice = (event) => { //ราคารถ
    setCarPrice(event.target.value);
  };

  const handlequantityLeft = (event) => { //จำนวนรถที่มี
    setQuantityLeft(event.target.value);
  };
 

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    try {
      // Upload the image to Strapi
      const formData = new FormData();
      formData.append("files", imageFile); //รูปรถ

      const uploadResponses = await axios.post(
        "/upload",
        formData,config
      );
      const fileId = uploadResponses.data[0].id; //ไอดีของรูปที่อัพโหลดไป

      const formDatas = new FormData();
      for (let i = 0; i < images.length; i++) {
        formDatas.append("files", images[i]); //เอารูปตำหนิมาลูปและเพิ่มเพื่ออัพโหลดหลายรูป
      }

      const uploadResponse = await axios.post(
        "/upload",
        formDatas,config
      );
      const fileIds = uploadResponse.data.map((d) => d.id); //ไอดีของรูปที่อัพโหลดไปของแต่ละรูป
      console.log(uploadResponse.data.map((d) => d.id));

      // Create or update the car entry in Strapi
      const formData2 = {
        namecar: carName,
        description: carDescription,
        price: parseInt(carPrice),
        remaining: parseInt(quantityLeft),
        imgcar: parseInt(fileId),
        imgslide: fileIds, 
      };

      const carResponse = await axios.post(
        `/cars`,
        { data: formData2 },config
        
      );
      console.log(
        "Car entry created/updated successfully:",
        carResponse.data.data.id
      );

      handleClose();
      props.fetch();
    } catch (error) {
      console.error("Error saving changes:", error);
      // Handle errors here
    }
  };

  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        เพิ่มรถ
      </Button>
     

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>รายละเอียด</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="carName">
              <Form.Label>ชื่อรุ่น</Form.Label>
              <Form.Control
                type="text"
                placeholder="ชื่อรุ่น"
                value={carName}
                onChange={handlecarName}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="carDescription">
              <Form.Label>รายละเอียดภายใน</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="รายละเอียดภายใน"
                value={carDescription}
                onChange={handlecarDescription}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="carPrice">
              <Form.Label>ราคา</Form.Label>
              <Form.Control
                type="number"
                placeholder="ราคา"
                value={carPrice}
                onChange={handlecarPrice}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="quantityLeft">
              <Form.Label>จำนวนที่เหลือ</Form.Label>
              <Form.Control
                type="number"
                placeholder="จำนวนที่เหลือ"
                value={quantityLeft}
                onChange={handlequantityLeft}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="imageFile">
              <Form.Label>รูปรถ</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="imageFile">
              <Form.Label>รูปตำหนิรถ</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleslideImageChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            ปิด
          </Button>
          <Button variant="primary" onClick={handleSaveChanges} disabled={images === null}>
            เพิ่มรถ
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdcreateCar;
