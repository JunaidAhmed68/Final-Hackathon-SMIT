// // src/components/HeroSlider.jsx
// import React, { useEffect, useState, useContext } from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useCart } from "../context/CartContext";
// import { AuthContext } from "../context/AuthContext";
// import axios from "axios";

// const HeroSlider = () => {
//   const [slides, setSlides] = useState([]);
//   const { addToCart } = useCart();
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchSlides = async () => {
//       try {
//         const res = await axios.get("https://e-app-delta.vercel.app/products?featured=true");
//         setSlides(res.data.products || []);
//       } catch (err) {
//         console.error("Slider fetch failed:", err);
//         toast.error("Failed to load featured products");
//       }
//     };

//     fetchSlides();
//   }, []);

//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 700,
//     autoplay: true,
//     autoplaySpeed: 4000,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: false,
//   };

//   const handleAddToCart = (product) => {
//     if (!user) return navigate("/login");
//     addToCart({ ...product, quantity: 1 });
//     toast.success("Added to cart");
//   };

//   const handleBuyNow = (product) => {
//     if (!user) return navigate("/login");
//     navigate("/checkout", {
//       state: {
//         buyNowItem: {
//           ...product,
//           quantity: 1,
//         },
//       },
//     });
//     };

//   if (!slides.length) return null;

//   return (
//     <div className="overflow-hidden">
//       <Slider {...settings}>
//         {slides.map((product) => (
//           <div key={product._id} className="relative h-[300px] md:h-[500px]">
//             <img
//               src={product.thumbnail}
//               alt={product.title}
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-4">
//               <h2 className="text-2xl md:text-4xl font-bold">{product.title}</h2>
//               <p className="mt-2 text-sm md:text-lg max-w-xl line-clamp-2">
//                 {product.description}
//               </p>
//               <div className="mt-4 flex gap-4">
//                 <button
//                   onClick={() => handleAddToCart(product)}
//                   className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium"
//                 >
//                   Add to Cart
//                 </button>
//                 <button
//                   onClick={() => handleBuyNow(product)}
//                   className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded font-medium"
//                 >               
//                   Buy Now
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// };

// export default HeroSlider;
