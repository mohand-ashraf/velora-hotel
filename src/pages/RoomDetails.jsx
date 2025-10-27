import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { DotLoader } from "react-spinners";
import {
  FaCheckCircle,
  FaUserFriends,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { MdArrowBack, MdHotel } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Modal, Box } from "@mui/material";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./RoomDetails.css";

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const roomRes = await axios.get(`http://localhost:5000/rooms/${id}`);
        setRoom(roomRes.data);

        const bookingsRes = await axios.get(`http://localhost:5000/bookings`);
        const roomBookings = bookingsRes.data.filter((b) => b.roomId === id);
        setBookings(roomBookings);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch room details or bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const isDateOverlap = (start1, end1, start2, end2) => {
    return (
      new Date(start1) < new Date(end2) && new Date(end1) > new Date(start2)
    );
  };

  const getDisabledDates = () => {
    const dates = [];
    bookings.forEach((b) => {
      const start = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
      }
    });
    return dates;
  };

  const disabledDates = getDisabledDates();

  const isDateDisabled = (date) => {
    return disabledDates.some(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    );
  };

  const handleBooking = async () => {
    try {
      const checkIn = range[0].startDate.toISOString().split("T")[0];
      const checkOut = range[0].endDate.toISOString().split("T")[0];

      if (!checkIn || !checkOut) {
        toast.warning("Please select your stay dates!");
        return;
      }

      if (new Date(checkOut) <= new Date(checkIn)) {
        toast.error("Check-out date must be after check-in date!");
        return;
      }

      const hasConflict = bookings.some((b) =>
        isDateOverlap(checkIn, checkOut, b.checkIn, b.checkOut)
      );

      if (hasConflict) {
        toast.error("This room is already booked for the selected dates!");
        return;
      }

      setIsBooking(true);

      const bookingData = {
        id: Math.random().toString(16).slice(2, 8),
        roomId: id,
        checkIn,
        checkOut,
        userId: user?.email || null,
      };

      await axios.post("http://localhost:5000/bookings", bookingData);

      toast.success("Room booked successfully!");
      setOpenModal(false);

      setBookings((prev) => [...prev, bookingData]);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      console.error("Booking Error:", err);
      toast.error("Failed to book the room. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#f5efe6] to-[#e9dcc9]">
        <DotLoader color="#b08968" size={55} />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-[#f5efe6] to-[#e9dcc9]">
        <h1 className="text-3xl font-bold text-[#5c4327]">Room not found</h1>
        <button
          onClick={() => navigate(-1)}
          className="mt-5 bg-[#b08968] hover:bg-[#a07652] text-white py-2 px-6 rounded-lg transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5efe6] to-[#e9dcc9] py-6 px-4 sm:px-6 md:px-10">
      <div className="max-w-[1150px] mx-auto bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-[#e0d3c2]">
        {/* Image Swiper */}
        <div className="relative h-[300px] sm:h-[400px] md:h-[450px] group">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            pagination={{
              clickable: true,
              bulletClass: "swiper-pagination-bullet custom-bullet",
              bulletActiveClass:
                "swiper-pagination-bullet-active custom-bullet-active",
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop
            className="h-full"
          >
            {room.images && room.images.length > 0 ? (
              room.images.map((img, index) => (
                <SwiperSlide key={index}>
                  <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px]">
                    <img
                      src={img}
                      alt={`${room.name} ${index + 1}`}
                      className="w-full h-full object-cover rounded-3xl transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-3xl"></div>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-[300px] sm:h-[400px] md:h-[450px] object-cover rounded-3xl"
                />
              </SwiperSlide>
            )}
          </Swiper>

          {/* Navigation arrows */}
          <button className="custom-prev absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 bg-white/80 text-[#5c4327] hover:bg-[#f5efe6] w-9 h-9 sm:w-11 sm:h-11 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10 backdrop-blur-sm">
            <FaChevronLeft size={16} />
          </button>
          <button className="custom-next absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 bg-white/80 text-[#5c4327] hover:bg-[#f5efe6] w-9 h-9 sm:w-11 sm:h-11 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10 backdrop-blur-sm">
            <FaChevronRight size={16} />
          </button>

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-3 sm:top-5 left-3 sm:left-5 flex items-center gap-1 bg-white/80 text-[#5c4327] hover:bg-[#f5efe6] py-1.5 px-3 sm:py-2 sm:px-4 rounded-full text-sm sm:text-base font-medium transition-all z-10 shadow-md backdrop-blur-sm"
          >
            <MdArrowBack size={16} className="sm:mr-1" /> Back
          </button>
        </div>

        {/* Info Section */}
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#4b3825] tracking-tight">
              {room.name}
            </h1>
            <div className="bg-[#b08968] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-lg text-lg sm:text-xl font-bold flex items-center gap-2 min-w-[120px]">
              {room.price.toLocaleString("en-EG")} EGP
              <span className="text-sm font-medium opacity-90">/night</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-5 text-[#6b5b3e] font-medium">
            <span className="flex items-center gap-1 sm:gap-2">
              <MdHotel className="text-[#b08968]" /> {room.type} Room
            </span>
            <span className="flex items-center gap-1 sm:gap-2">
              <FaUserFriends className="text-[#b08968]" /> {room.capacity}{" "}
              {room.capacity > 1 ? "Guests" : "Guest"}
            </span>
          </div>

          <p className="text-[#5a4a30] leading-relaxed text-base sm:text-lg border-l-4 border-[#b08968] pl-3 sm:pl-4">
            {room.description}
          </p>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#4b3825] mb-4">
              Room Amenities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {room.amenities.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-[#f5efe6] border border-[#d9cbb7] px-3 py-2 sm:px-4 sm:py-3 rounded-xl text-sm sm:text-base text-[#5c4327] shadow-sm hover:shadow-md hover:bg-[#ede2cf] transition-all"
                >
                  <FaCheckCircle className="text-[#b08968]" />
                  {a}
                </div>
              ))}
            </div>
          </div>

          {user ? (
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-base sm:text-lg font-medium min-w-[250px]">
                <FaCheckCircle className="text-green-600 text-xl sm:text-2xl" />
                <span className="text-green-700">
                  Booking available based on your selected dates.
                </span>
              </div>

              {/* تعديل محاذاة زرار الحجز */}
              <div className="flex justify-center sm:justify-end w-full sm:w-auto mt-3 sm:mt-0">
                <button
                  onClick={() => setOpenModal(true)}
                  disabled={isBooking}
                  className={`px-8 sm:px-10 py-2.5 sm:py-3 rounded-xl font-semibold text-white text-base sm:text-lg transition-all shadow-lg bg-gradient-to-r from-[#b08968] to-[#a07652] hover:scale-105 hover:shadow-xl`}
                >
                  {isBooking ? "Booking..." : "Book Now"}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 sm:mt-8 text-center text-[#5c4327] text-base sm:text-xl font-medium">
              Please{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-[#b08968] cursor-pointer hover:underline font-semibold"
              >
                login
              </span>{" "}
              to book this room.
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            boxShadow: 24,
            borderRadius: 3,
            p: 3,
            width: "fit-content",
            maxWidth: "95%",
          }}
        >
          <h2 className="text-2xl font-bold text-[#4b3825] mb-6 text-center">
            Select Booking Dates
          </h2>

          <div className="flex justify-center mb-6">
            <DateRange
              editableDateInputs={true}
              onChange={(item) => {
                const start = item.selection.startDate;
                const end = item.selection.endDate;

                // منع اختيار الأيام المحجوزة
                let conflict = false;
                for (
                  let d = new Date(start);
                  d <= end;
                  d.setDate(d.getDate() + 1)
                ) {
                  if (isDateDisabled(new Date(d))) {
                    conflict = true;
                    break;
                  }
                }

                if (!conflict) {
                  setRange([item.selection]);
                }
              }}
              moveRangeOnFirstSelection={false}
              ranges={range}
              rangeColors={["#b08968"]}
              minDate={new Date()}
              months={1}
              direction="horizontal"
              className="max-w-full"
              disabledDates={disabledDates}
              dayContentRenderer={(day) => {
                const isDisabled = isDateDisabled(day);
                return (
                  <div
                    style={{
                      color: isDisabled ? "#ccc" : "#000",
                      backgroundColor: isDisabled ? "#f0f0f0" : "transparent",
                      pointerEvents: isDisabled ? "none" : "auto",
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                    }}
                  >
                    {day.getDate()}
                  </div>
                );
              }}
            />
          </div>

          <button
            onClick={handleBooking}
            disabled={isBooking}
            className="bg-gradient-to-r from-[#b08968] to-[#a07652] text-white py-3 px-8 rounded-xl font-semibold text-lg hover:scale-105 transition-all shadow-md w-full"
          >
            {isBooking ? "Booking..." : "Confirm Booking"}
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default RoomDetails;
