import React, { useState } from "react";
import { Card } from "react-bootstrap";

import {
  Form,
  InputGroup,
  Button,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { FaSearch, FaMapMarkerAlt, FaHome, FaRupeeSign } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const properties = [
    {
      id: 1,
      title: "Owner Properties",
      count: "3308",
      image:
        "https://cdn.staticmb.com/magicservicestatic/images/mb-home-web/collection/buy/webp/owner-property.webp", // Replace with your actual image
    },
    {
      id: 2,
      title: "Projects",
      count: "162",
      image:
        "https://cdn.staticmb.com/magicservicestatic/images/mb-home-web/collection/buy/webp/new-projects.webp",
    },
    {
      id: 3,
      title: "Ready to move-in",
      count: "2533",
      image:
        "https://cdn.staticmb.com/magicservicestatic/images/mb-home-web/collection/buy/webp/ready-to-move-in.webp",
    },
    {
      id: 4,
      title: "Budget Homes",
      count: "221",
      image:
        "https://cdn.staticmb.com/magicservicestatic/images/mb-home-web/collection/buy/webp/budget-homes.webp",
    },
  ];

  return (
    <div>
      <div style={{ position: "absolute", width: "100%", zIndex: 999 }}>
        <nav
          className="navbar navbar-expand-lg "
          style={{ minHeight: "30px", padding: "2px 0" , backgroundColor: "#dc3545",}}
        >    
          <div className="container">
            <div
              className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
              id="navbarNav"
            >
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    MB Prime
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    Login
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    Post Property
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <nav
          className="navbar navbar-expand-lg navbar-dark bg-dark"
          style={{
            backgroundColor: "#dc3545",
            position: "sticky",
            top: 0,
            zIndex: 1000, // Ensures navbar stays above other content
          }}
        >
          <div className="container">
            <a className="navbar-brand" href="#">
              <img
                src="https://cdn.staticmb.com/magicservicestatic/images/revamp/mb-logo-web-white.svg"
                alt="Your Company"
                style={{ height: "32px" }}
              />
            </a>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded={isOpen ? "true" : "false"}
              aria-label="Toggle navigation"
              onClick={toggleMenu}
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
              className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
              id="navbarNav"
            >
              <ul className="navbar-nav ms-auto">
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-white"
                    href="#"
                    id="buyDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Buy
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="buyDropdown">
                    <li>
                      <a className="dropdown-item" href="#">
                        Buy Property
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item " href="#">
                        Buy Apartments
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-white"
                    href="#"
                    id="rentDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Rent
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="rentDropdown">
                    <li>
                      <a className="dropdown-item" href="#">
                        Rent Property
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Rent Apartments
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-white"
                    href="#"
                    id="sellDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    New Projects
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="sellDropdown">
                    <li>
                      <a className="dropdown-item" href="#">
                        Sell Property
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Sell Apartments
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-white"
                    href="#"
                    id="homeLoanDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Plot
                  </a>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="homeLoanDropdown"
                  >
                    <li>
                      <a className="dropdown-item" href="#">
                        Apply for Home Loan
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Home Loan Calculator
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-white"
                    href="#"
                    id="interiorsDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Commercial
                  </a>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="interiorsDropdown"
                  >
                    <li>
                      <a className="dropdown-item" href="#">
                        Interior Design
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Furniture
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-white"
                    href="#"
                    id="mbAdviceDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    PG
                  </a>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="mbAdviceDropdown"
                  >
                    <li>
                      <a className="dropdown-item" href="#">
                        Property Advice
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Investment Tips
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-white"
                    href="#"
                    id="helpDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Projects
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="helpDropdown">
                    <li>
                      <a className="dropdown-item" href="#">
                        Help Center
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Sales Enquiry
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className=" mx-auto" style={{ width: "60%", marginTop: "8rem" }}>
          <div>
            <h1 className="text-white text-center mb-5">
              {/* Find A Home You'll Love */}
              Luxury Living , Elevated
            </h1>
          </div>
          <nav className="d-flex justify-content-start align-items-center">
            <span className="me-3 fw-bold text-danger">City</span>
            <span className="me-3 fw-bold border-bottom border-danger text-primary">
              Locality
            </span>
            <span className="me-3 text-white">Project Name</span>
            <span className="me-3 text-white">Keyword</span>
            <span className="me-3 text-white">Builder Name</span>
            {/* <span className="me-3">Commercial</span>
              <span className="text-primary">Post Free Property Ad</span> */}
          </nav>

          <div className="search-bar mt-3  rounded-pill shadow-sm d-flex align-items-center bg-white">
            <InputGroup className="ms-2">
              <InputGroup.Text className="bg-white border-0">
                <FaMapMarkerAlt className="text-danger" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Bhubaneswar"
                className="border-0"
              />
            </InputGroup>

            <span className="mx-2 text-muted">|</span>

            <DropdownButton
              variant="white"
              title={
                <>
                  <FaHome className="text-danger" /> Flat +1
                </>
              }
            >
              <Dropdown.Item>Flat</Dropdown.Item>
              <Dropdown.Item>House</Dropdown.Item>
              <Dropdown.Item>Villa</Dropdown.Item>
            </DropdownButton>

            <span className="mx-2 text-muted">|</span>

            <DropdownButton
              variant="white"
              title={
                <>
                  <FaRupeeSign className="text-danger" /> Budget
                </>
              }
            >
              <Dropdown.Item>Below 20 Lakh</Dropdown.Item>
              <Dropdown.Item>20-50 Lakh</Dropdown.Item>
              <Dropdown.Item>Above 50 Lakh</Dropdown.Item>
            </DropdownButton>

            <Button variant="danger" className="rounded-pill ms-auto px-4">
              <FaSearch /> Search
            </Button>
          </div>
        </div>
        <div className="container my-5 " style={{ paddingTop: "8rem" }}>
          <h2 className="fw-bold text-white">
            We've got properties in Bhubaneswar for everyone
          </h2>
          <div
            className="border-bottom border-danger mb-3"
            style={{ width: 50 }}
          ></div>

          <div className="d-flex gap-4 overflow-auto">
            {properties.map((property) => (
              <Card
                key={property.id}
                className="border-0  rounded-4 "
                style={{ width: "300px" }}
              >
                <div
                  className="rounded-4"
                  style={{
                    backgroundImage: `url(${property.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "200px",
                    position: "relative",
                  }}
                >
                  <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-25 rounded-4"></div>
                </div>
                <Card.Body className="text-white position-absolute bottom-0 p-3">
                  <h4 className="fw-bold">{property.count}</h4>
                  <p className="m-0">{property.title}</p>
                  <a
                    href="#"
                    className="text-white fw-bold d-flex align-items-center"
                  >
                    Explore →
                  </a>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <div
        id="carouselExample"
        className="carousel slide"
        data-bs-ride="carousel"
        style={{ position: "relative" }}
      >
        <div className="carousel-inner">
          {/* Slide 1 */}
          <div
            className="carousel-item active position-relative"
            style={{
              backgroundImage:
                'url("http://hompark.themezinho.net/wp-content/uploads/2020/03/slide03.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100vh",
            }}
          >
            {/* Gray Shadow Overlay */}
            <div
              className="overlay"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(6, 6, 6, 0.61)",
              }}
            ></div>
          </div>

          {/* Slide 2 */}
          <div
            className="carousel-item position-relative"
            style={{
              backgroundImage:
                'url("http://hompark.themezinho.net/wp-content/uploads/2020/03/slide01.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100vh",
            }}
          >
            <div
              className="overlay"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(6, 6, 6, 0.61)",
              }}
            ></div>
          </div>

          {/* Slide 3 */}
          <div
            className="carousel-item position-relative"
            style={{
              backgroundImage:
                'url("http://hompark.themezinho.net/wp-content/uploads/2020/03/slide02.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100vh",
            }}
          >
            <div
              className="overlay"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(6, 6, 6, 0.61)",
              }}
            ></div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
