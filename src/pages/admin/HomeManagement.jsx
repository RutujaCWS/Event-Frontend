// import React, { useState } from "react";

// const HomeManagement = () => {
//   const [formData, setFormData] = useState({
//     bannerTitle: "Plan Your Perfect Event — Without the Stress",
//     bannerDescription:
//       "From weddings to corporate events, we handle everything — planning, coordination, and execution.",
//     button1: "Plan Your Event",
//     button2: "Request Quote",
//     welcomeMessage:
//       "Trusted by 5000+ customers to deliver memorable and hassle-free events.",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSave = () => {
//     console.log(formData);
//     alert("Home Page Content Saved");
//   };

//   return (
//     <div>
//       <h4 className="mb-4">Home Page Management</h4>

//       <div className="mb-3">
//         <label className="form-label fw-bold">
//           Banner Title
//         </label>
//         <input
//           type="text"
//           name="bannerTitle"
//           value={formData.bannerTitle}
//           onChange={handleChange}
//           className="form-control"
//         />
//       </div>

//       <div className="mb-3">
//         <label className="form-label fw-bold">
//           Banner Description
//         </label>
//         <textarea
//           rows="4"
//           name="bannerDescription"
//           value={formData.bannerDescription}
//           onChange={handleChange}
//           className="form-control"
//         />
//       </div>

//       <div className="row">
//         <div className="col-md-6 mb-3">
//           <label className="form-label fw-bold">
//             Primary Button Text
//           </label>
//           <input
//             type="text"
//             name="button1"
//             value={formData.button1}
//             onChange={handleChange}
//             className="form-control"
//           />
//         </div>

//         <div className="col-md-6 mb-3">
//           <label className="form-label fw-bold">
//             Secondary Button Text
//           </label>
//           <input
//             type="text"
//             name="button2"
//             value={formData.button2}
//             onChange={handleChange}
//             className="form-control"
//           />
//         </div>
//       </div>

//       <div className="mb-3">
//         <label className="form-label fw-bold">
//           Welcome Message
//         </label>
//         <textarea
//           rows="3"
//           name="welcomeMessage"
//           value={formData.welcomeMessage}
//           onChange={handleChange}
//           className="form-control"
//         />
//       </div>

//       <div className="mb-4">
//         <label className="form-label fw-bold">
//           Hero Background Image
//         </label>
//         <input
//           type="file"
//           className="form-control"
//         />
//       </div>

//       <button
//         className="btn btn-primary px-4"
//         onClick={handleSave}
//       >
//         Save Changes
//       </button>
//     </div>
//   );
// };

// export default HomeManagement;