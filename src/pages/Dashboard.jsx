import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCalendarAlt } from "react-icons/fa";
import { DotLoader } from "react-spinners";
import Swal from "sweetalert2";
import Pagination from "@mui/material/Pagination";

const pageSize = 6;

const Dashboard = () => {
  const currentUser = useSelector((state) => state.auth.user?.email || null);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const start = Date.now();

    const fetchData = async () => {
      try {
        const bookingsRes = await axios.get("http://localhost:5000/bookings");
        const allBookings = Array.isArray(bookingsRes.data)
          ? bookingsRes.data
          : bookingsRes.data?.bookings || [];

        const userBookings = currentUser
          ? allBookings.filter((booking) => booking.userId === currentUser)
          : [];

        const today = new Date();
        const activeBookings = userBookings.filter(
          (b) => new Date(b.checkOut) >= today
        );

        const roomsRes = await axios.get("http://localhost:5000/rooms");
        const allRooms = Array.isArray(roomsRes.data)
          ? roomsRes.data
          : roomsRes.data?.rooms || [];

        const duration = Date.now() - start;
        const remaining = 1000 - duration;

        setTimeout(
          () => {
            setBookings(activeBookings);
            setRooms(allRooms);
            setLoading(false);

            if (activeBookings.length === 0 && currentUser) {
              toast.error("You have no active reservations.");
            }
          },
          remaining > 0 ? remaining : 0
        );
      } catch (err) {
        console.error("Fetch Error:", err);
        setLoading(false);
        toast.error("Failed to load reservations");
      }
    };

    fetchData();
  }, [currentUser]);

  const getRoomById = (roomId) => rooms.find((r) => r.id === roomId);

  const handleCancel = async (bookingId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to cancel this reservation?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/bookings/${bookingId}`);
        setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        toast.success("Reservation cancelled successfully!");
      } catch (err) {
        console.error("Cancel Error:", err);
        toast.error("Failed to cancel reservation");
      }
    }
  };

  const handlePageChange = (event, value) => {
    setLoading(true);
    setTimeout(() => {
      setCurrentPage(value - 1);
      setLoading(false);
    }, 500);
  };

  const paginatedBookings = bookings.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#f5efe6] to-[#e9dcc9]">
        <DotLoader color="#b08968" size={50} />
      </div>
    );

  if (!currentUser)
    return (
      <div className="flex justify-center items-center h-[300px] w-full mb-10">
        <h1 className="font-Playwrite text-[50px] text-[#5c4327] font-semibold opacity-50 text-center">
          Please log in to view your reservations.
        </h1>
      </div>
    );

  if (bookings.length === 0)
    return (
      <div className="flex justify-center items-center h-[300px] w-full mb-10">
        <h1 className="font-Playwrite text-[70px] text-[#5c4327] font-semibold opacity-50 text-center">
          You have no active reservations.
        </h1>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5efe6] to-[#e9dcc9] py-10 px-4">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#b08968] via-[#5c4327] to-[#a07652] drop-shadow-lg mb-12 transition-transform duration-500 ease-out transform hover:scale-105 group leading-snug sm:leading-snug md:leading-tight lg:leading-tight">
          My Reservations
        </h1>

        {/* Bookings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 relative z-0">
          {paginatedBookings.map((booking) => {
            const room = getRoomById(booking.roomId);
            if (!room) return null;

            return (
              <div
                key={booking.id}
                className="relative bg-white rounded-3xl shadow-xl overflow-visible transform hover:scale-105 transition-all duration-300 flex flex-col hover:z-50"
              >
                <div className="overflow-hidden h-52 rounded-t-3xl">
                  <img
                    src={
                      room.images?.[0] || "https://via.placeholder.com/400x250"
                    }
                    alt={room.type}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>

                <div className="p-5 flex flex-col gap-3">
                  <h3
                    className="text-2xl font-bold text-[#5c4327] overflow-hidden text-ellipsis whitespace-nowrap"
                    title={room.name}
                  >
                    {room.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[#5c4327]">
                      {room.type}
                    </h2>
                    <p className="text-lg font-semibold text-[#6b5b3e]">
                      {room.price.toLocaleString("en-EG")} EGP / night
                    </p>
                  </div>

                  {/* التواريخ */}
                  <div className="flex flex-col items-start justify-start mt-3 text-sm text-[#5c4327] gap-1">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="text-blue-500" /> Check-in:{" "}
                      {booking.checkIn || "N/A"}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="text-red-500" /> Check-out:{" "}
                      {booking.checkOut || "N/A"}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg mt-3 transition-all duration-300 shadow-md"
                  >
                    Cancel Reservation
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {bookings.length > pageSize && (
          <div className="flex justify-center mt-10">
            <Pagination
              count={Math.ceil(bookings.length / pageSize)}
              page={currentPage + 1}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              size="large"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#5c4327",
                  borderColor: "#d9cbb7",
                  fontWeight: "600",
                },
                "& .MuiPaginationItem-root.Mui-selected": {
                  backgroundColor: "#b08968",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#a07652",
                  },
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
