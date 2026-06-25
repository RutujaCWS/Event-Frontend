import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getGalleryEvents } from "../../services/galleryService";
import { getCmsSection } from "../../services/cmsService";
import Header from "./Header";
import Footer from "./Footer";

const servicesData = {
 "wedding-events": {
  title: "Wedding Events",
  overview: "Complete wedding planning and management services.",
  price: "Starting from ₹50,000",
  inclusions: [
    "Venue Decoration",
    "Catering",
    "Photography",
    "Entertainment",
  ],
  addons: [
    "DJ Setup",
    "Live Band",
    "Premium Floral Decoration",
  ],
  process: [
    "Requirement Discussion",
    "Budget Planning",
    "Vendor Selection",
    "Event Execution",
  ],
  images: [
    "https://images.unsplash.com/photo-1519741497674-611481863552",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
  ],
},

  "birthday-events": {
  title: "Birthday Events",
  overview:
    "Customized birthday event planning services for kids, teens, and adults with creative themes and memorable experiences.",
  price: "Starting from ₹15,000",

  inclusions: [
    "Theme Decoration",
    "Cake Arrangement",
    "Photography",
    "Entertainment Activities",
  ],

  addons: [
    "Magic Show",
    "DJ & Music Setup",
    "Photo Booth",
    "Return Gift Arrangements",
  ],

  process: [
    "Theme Selection",
    "Budget Planning",
    "Venue Decoration",
    "Event Execution",
  ],

  images: [
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3",
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d",
    "https://images.unsplash.com/photo-1513151233558-d860c5398176",
  ],
},

"corporate-events": {
  title: "Corporate Events",
  overview:
    "Professional corporate event management for conferences, seminars, product launches, team outings, and business meetings.",
  price: "Starting from ₹25,000",

  inclusions: [
    "Conference Setup",
    "Audio Visual Support",
    "Event Coordination",
    "Guest Management",
  ],

  addons: [
    "Live Streaming",
    "Corporate Branding",
    "Professional Anchoring",
    "Video Production",
  ],

  process: [
    "Requirement Gathering",
    "Event Planning",
    "Logistics Management",
    "Event Execution",
  ],

  images: [
    "https://images.unsplash.com/photo-1511578314322-379afb476865",
    "https://images.unsplash.com/photo-1540317580384-e5d43867caa6",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
  ],
},

"religious-events": {
  title: "Religious & Cultural Events",
  overview:
    "End-to-end planning and management of religious ceremonies, festivals, cultural programs, and community gatherings.",
  price: "Starting from ₹20,000",

  inclusions: [
    "Stage Decoration",
    "Lighting Arrangements",
    "Guest Seating",
    "Event Coordination",
  ],

  addons: [
    "Sound System",
    "Traditional Decor",
    "Live Streaming",
    "Food Arrangements",
  ],

  process: [
    "Event Consultation",
    "Venue Preparation",
    "Vendor Coordination",
    "Successful Execution",
  ],

  images: [
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
  ],
},

"custom-events": {
  title: "Custom Events",
  overview:
    "Tailor-made event management solutions designed to meet unique requirements and special occasions of any scale.",
  price: "Starting from ₹30,000",

  inclusions: [
    "Customized Planning",
    "Vendor Coordination",
    "Venue Management",
    "Event Execution Support",
  ],

  addons: [
    "Luxury Decor",
    "Celebrity Appearances",
    "Special Entertainment",
    "Premium Catering",
  ],

  process: [
    "Requirement Analysis",
    "Custom Planning",
    "Resource Allocation",
    "Event Delivery",
  ],

  images: [
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329",
  ],
},
};

const ServiceDetails = () => {
  const { slug } = useParams();
  const [galleryImages, setGalleryImages] = useState([]);
const [service, setService] = useState(null);

const serviceImages =
  servicesData[slug]?.images || [];
  useEffect(() => {
  fetchServiceData();
  fetchGalleryImages();
}, [slug]);

const fetchGalleryImages = async () => {
  try {
    const res = await getGalleryEvents();

    const categoryMap = {
      "wedding-events": "Wedding",
      "birthday-events": "Birthday",
      "corporate-events": "Corporate",
      "religious-events": "Cultural Event",
      "custom-events": "Custom",
    };

    const category = categoryMap[slug];

    const filteredImages = res.data.data
      .filter((item) => item.category === category)
      .slice(0, 3);

    setGalleryImages(filteredImages);
  } catch (error) {
    console.log(error);
  }
};
const fetchServiceData = async () => {
  try {
    const res = await getCmsSection(slug);

    console.log("Service Data:", res.data);

    if (res.data?.data?.content) {
      setService(res.data.data.content);
    }
  } catch (error) {
    console.log(error);
  }
};
  if (!service) {
    return <h2 className="text-center mt-5">Service Not Found</h2>;
  }
  

 return (
    <>
    <Header />

    {/* Hero Banner */}
    <section
        className="position-relative"
        style={{
        height: "550px",
        backgroundImage: `url(${serviceImages[0]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        }}
    >
        <div
        style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
        }}
        />

        <div className="container h-100 position-relative">
        <div className="d-flex flex-column justify-content-center align-items-center h-100 text-center text-white">
            <h1 className="display-3 fw-bold">{service.title}</h1>

            <p
            className="lead mt-3"
            style={{ maxWidth: "750px" }}
            >
            {service.overview}
            </p>

            <button className="btn btn-warning btn-lg mt-3 px-5">
            Get Free Quote
            </button>
        </div>
        </div>
    </section>

    {/* Price Card */}
    <div className="container">
        <div
        className="bg-white rounded-4 shadow-lg p-4 text-center"
        style={{
            marginTop: "-50px",
            position: "relative",
            zIndex: 2,
        }}
        >
        <h6 className="text-muted">
            Starting Price
        </h6>

        <h2 className="fw-bold text-success">
            {service.price}
        </h2>
        </div>
    </div>

    <div className="container py-5">

        {/* Overview */}
        <section className="mb-5">
        <h2 className="fw-bold mb-4">
            Service Overview
        </h2>

        <p
            className="text-muted"
            style={{
            lineHeight: "1.9",
            fontSize: "17px",
            }}
        >
            {service.overview}
        </p>
        </section>

        {/* Inclusions */}
        <section className="mb-5">
        <h2 className="fw-bold text-center mb-5">
            What's Included
        </h2>

        <div className="row g-4">
            {service.inclusions.map((item, index) => (
            <div className="col-lg-3 col-md-6" key={index}>
                <div
                className="text-center p-4 rounded-4 h-100"
                style={{
                    background: "#fff",
                    boxShadow:
                    "0 5px 20px rgba(0,0,0,0.08)",
                }}
                >
                <div className="fs-1 mb-3">✅</div>

                <h6>{item}</h6>
                </div>
            </div>
            ))}
        </div>
        </section>

        {/* Addons */}
        <section className="mb-5">
        <h2 className="fw-bold text-center mb-5">
            Optional Add-ons
        </h2>

        <div className="row g-4">
            {service.addons.map((item, index) => (
            <div className="col-lg-3 col-md-6" key={index}>
                <div
                className="text-center p-4 rounded-4 h-100"
                style={{
                    background: "#f8f9fa",
                    boxShadow:
                    "0 5px 20px rgba(0,0,0,0.08)",
                }}
                >
                <div className="fs-1 mb-3">✨</div>

                <h6>{item}</h6>
                </div>
            </div>
            ))}
        </div>
        </section>

        {/* Event Process */}
        <section className="mb-5">
        <h2 className="fw-bold text-center mb-5">
            Event Process
        </h2>

        <div className="row text-center">
            {service.process.map((step, index) => (
            <div className="col-lg-3" key={index}>
                <div className="position-relative">
                <div
                    className="mx-auto mb-3"
                    style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    background: "#7c3aed",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                    }}
                >
                    {index + 1}
                </div>

                <h6>{step}</h6>
                </div>
            </div>
            ))}
        </div>
        </section>

        {/* Gallery */}
        <section className="mb-5">
  <h2 className="fw-bold text-center mb-5">
    Sample Images
  </h2>

  <div className="row g-4">
    {galleryImages.map((item) => (
      <div
        className="col-lg-4"
        key={item._id}
      >
        <img
          src={item.image}
          alt={item.eventName}
          className="img-fluid rounded-4 shadow"
          style={{
            height: "320px",
            width: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    ))}
  </div>
</section>

        {/* Stats */}
        <section
        className="py-5 rounded-4 mb-5"
        style={{
            background: "#111827",
            color: "#fff",
        }}
        >
        <div className="row text-center">
            <div className="col-md-4">
            <h2 className="fw-bold">500+</h2>
            <p>Events Completed</p>
            </div>

            <div className="col-md-4">
            <h2 className="fw-bold">1000+</h2>
            <p>Happy Clients</p>
            </div>

            <div className="col-md-4">
            <h2 className="fw-bold">10+</h2>
            <p>Years Experience</p>
            </div>
        </div>
        </section>

       

    </div>

    <Footer />
    </>
);
};

export default ServiceDetails;