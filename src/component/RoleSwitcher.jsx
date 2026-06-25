// // src/components/RoleSwitcher.jsx
// import { useNavigate } from "react-router-dom";

// const RoleSwitcher = () => {
//   const navigate = useNavigate();

//   const switchRole = (role) => {
//     localStorage.setItem("user", JSON.stringify({ role, name: `${role.toUpperCase()} User` }));
//     window.location.reload(); // refresh to update sidebar and header
//   };

//   return (
//     <div className="mb-3 p-2 bg-light rounded d-flex gap-2">
//       <button className="btn btn-sm btn-outline-primary" onClick={() => switchRole("customer")}>
//         Switch to Customer
//       </button>
//       <button className="btn btn-sm btn-outline-secondary" onClick={() => switchRole("staff")}>
//         Switch to Staff
//       </button>
//     </div>
//   );
// };

// export default RoleSwitcher;