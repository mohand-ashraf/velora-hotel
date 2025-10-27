import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { DotLoader } from "react-spinners";
import { MdHotel } from "react-icons/md";
import { FaDollarSign, FaCheck, FaSort } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";

const roomOptions = ["Single", "Double", "Suite"];
const pageSize = 6;

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const sortRef = useRef();
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const start = Date.now();
    axios
      .get("https://68ff71e3e02b16d1753dfced.mockapi.io/api/vi/rooms")
      .then((res) => {
        const duration = Date.now() - start;
        const remaining = 1000 - duration;
        setTimeout(
          () => {
            setRooms(res.data);
            setFilteredRooms(res.data);
            setLoading(false);
            if (res.data.length === 0) toast.error("No rooms available.");
          },
          remaining > 0 ? remaining : 0
        );
      })
      .catch(() => {
        setLoading(false);
        toast.error("Error loading rooms. Please try again later.");
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setDropdownOpen(false);
      if (sortRef.current && !sortRef.current.contains(event.target))
        setSortDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    if (option === "All") {
      if (typeFilter.length === roomOptions.length) setTypeFilter([]);
      else setTypeFilter([...roomOptions]);
    } else {
      setTypeFilter((prev) =>
        prev.includes(option)
          ? prev.filter((item) => item !== option)
          : [...prev, option]
      );
    }
  };

  const handleFilter = () => {
    if (typeFilter.length === 0 && minPrice === "" && maxPrice === "") {
      toast.error("Please enter at least one filter.");
      return;
    }
    if (minPrice !== "" && Number(minPrice) < 1)
      toast.error("Min Price must be at least 1.");
    if (maxPrice !== "" && Number(maxPrice) < 1)
      toast.error("Max Price must be at least 1.");
    if (
      minPrice !== "" &&
      maxPrice !== "" &&
      Number(maxPrice) < Number(minPrice)
    )
      toast.error("Max price cannot be less than Min price.");

    setLoading(true);
    setTimeout(() => {
      const filtered = rooms.filter((room) => {
        const matchesType =
          typeFilter.length > 0 ? typeFilter.includes(room.type) : true;
        const matchesMin = minPrice ? room.price >= Number(minPrice) : true;
        const matchesMax = maxPrice ? room.price <= Number(maxPrice) : true;
        return matchesType && matchesMin && matchesMax;
      });

      setFilteredRooms(filtered);
      setCurrentPage(0);
      setLoading(false);
      if (filtered.length === 0 && rooms.length > 0)
        toast.error("No rooms match your filter.");
      else toast.success("Search applied successfully!");
    }, 500);
  };

  const handleSort = (order) => {
    setSortOrder(order);
    setLoading(true);
    setTimeout(() => {
      let sorted = [...filteredRooms];
      if (order === "asc") sorted.sort((a, b) => a.price - b.price);
      else if (order === "desc") sorted.sort((a, b) => b.price - a.price);
      setFilteredRooms(sorted);
      setSortDropdownOpen(false);
      setLoading(false);
      toast.success("Sort applied successfully!");
    }, 500);
  };

  const handlePageChange = (event, value) => {
    setLoading(true);
    setTimeout(() => {
      setCurrentPage(value - 1);
      setLoading(false);
    }, 500);
  };

  const paginatedRooms = filteredRooms.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#f5efe6] to-[#e9dcc9]">
        <DotLoader color="#b08968" size={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5efe6] to-[#e9dcc9] py-10 px-4">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="relative text-5xl sm:text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#b08968] via-[#5c4327] to-[#a07652] drop-shadow-lg mb-12 transition-transform duration-500 ease-out transform hover:scale-105 group">
          Available Rooms
          <span className="absolute left-1/2 bottom-[-10px] w-0 h-1.5 bg-gradient-to-r from-[#b08968] via-[#5c4327] to-[#a07652] rounded-full -translate-x-1/2 transition-all duration-500 ease-out group-hover:w-1/2 group-hover:shadow-[0_0_8px_rgba(176,137,104,0.7)] group-hover:opacity-100 opacity-0"></span>
        </h1>

        {/* Filter & Sort Section */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_0_40px_10px_rgba(233,220,201,0.8)] mb-10 w-full flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-4 w-full">
            {/* Type Filter */}
            <div
              ref={dropdownRef}
              className="relative w-full lg:flex-[1.6] h-[50px]"
            >
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center h-full bg-[#f5efe6] rounded-lg border border-[#d9cbb7] px-3 cursor-pointer"
              >
                <MdHotel className="text-[22px] text-[#5c4327] mr-2" />
                <span className="text-[#6b5b3e] w-full truncate">
                  {typeFilter.length === 0
                    ? "Room Type"
                    : typeFilter.join(", ")}
                </span>
                <span
                  className={`ml-auto text-[#5c4327] transition-transform duration-300 ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ▼
                </span>
              </div>
              <div
                className={`absolute mt-1 w-full bg-[#f5efe6] border border-[#d9cbb7] rounded-lg z-10 shadow-lg max-h-48 overflow-y-auto transform transition-all duration-300 ease-in-out ${
                  dropdownOpen
                    ? "opacity-100 scale-y-100"
                    : "opacity-0 scale-y-0 pointer-events-none"
                } origin-top`}
              >
                <div
                  onClick={() => toggleOption("All")}
                  className={`flex items-center justify-between px-3 py-2 cursor-pointer ${
                    typeFilter.length === roomOptions.length
                      ? "bg-[#b08968] text-white"
                      : "text-[#6b5b3e]"
                  } hover:bg-[#a07652] hover:text-white`}
                >
                  <span>
                    {typeFilter.length === roomOptions.length
                      ? "Unselect All"
                      : "Select All"}
                  </span>
                  {typeFilter.length === roomOptions.length && <FaCheck />}
                </div>
                {roomOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => toggleOption(option)}
                    className={`flex items-center justify-between px-3 py-2 cursor-pointer ${
                      typeFilter.includes(option)
                        ? "bg-[#b08968] text-white"
                        : "text-[#6b5b3e]"
                    } hover:bg-[#a07652] hover:text-white`}
                  >
                    <span>{option}</span>
                    {typeFilter.includes(option) && <FaCheck />}
                  </div>
                ))}
              </div>
            </div>

            {/* Min Price */}
            <div className="flex items-center w-full lg:flex-1 h-[50px] bg-[#f5efe6] rounded-lg px-3 border border-[#d9cbb7]">
              <FaDollarSign className="text-[28px] text-[#5c4327] mr-2" />
              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                min="1"
                onChange={(e) => setMinPrice(e.target.value)}
                className="focus:outline-none w-full h-full bg-transparent placeholder:text-[#6b5b3e]"
              />
            </div>

            {/* Max Price */}
            <div className="flex items-center w-full lg:flex-1 h-[50px] bg-[#f5efe6] rounded-lg px-3 border border-[#d9cbb7]">
              <FaDollarSign className="text-[28px] text-[#5c4327] mr-2" />
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                min="1"
                onChange={(e) => setMaxPrice(e.target.value)}
                className="focus:outline-none w-full h-full bg-transparent placeholder:text-[#6b5b3e]"
              />
            </div>

            {/* Sort Dropdown */}
            <div
              ref={sortRef}
              className="w-full lg:w-[200px] h-[50px] relative"
            >
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="w-full h-full bg-[#b08968] hover:bg-[#a07652] text-white font-medium rounded-lg px-4 flex items-center justify-between transition-all duration-300 shadow-md"
              >
                <div className="flex items-center gap-2 flex-nowrap">
                  <FaSort />
                  <span className="whitespace-nowrap">
                    {sortOrder === ""
                      ? "Sort by Price"
                      : sortOrder === "asc"
                      ? "Low to High"
                      : "High to Low"}
                  </span>
                </div>
                <span
                  className={`ml-2 transition-transform ${
                    sortDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ▼
                </span>
              </button>
              <div
                className={`absolute mt-1 w-full bg-[#f5efe6] border border-[#d9cbb7] rounded-lg z-10 shadow-lg overflow-hidden transform transition-all duration-300 ease-in-out origin-top ${
                  sortDropdownOpen
                    ? "opacity-100 scale-y-100 pointer-events-auto"
                    : "opacity-0 scale-y-0 pointer-events-none"
                }`}
              >
                <div
                  className="px-4 py-2 cursor-pointer hover:bg-[#a07652] hover:text-white flex items-center gap-2"
                  onClick={() => handleSort("asc")}
                >
                  <FaDollarSign />
                  Low to High
                </div>
                <div
                  className="px-4 py-2 cursor-pointer hover:bg-[#a07652] hover:text-white flex items-center gap-2"
                  onClick={() => handleSort("desc")}
                >
                  <FaDollarSign />
                  High to Low
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleFilter}
              className="w-full lg:w-[150px] bg-[#b08968] hover:bg-[#a07652] text-white font-medium text-[18px] py-3 rounded-xl transition-all duration-300 whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </div>

        {/* Empty State */}
        {paginatedRooms.length === 0 && (
          <div className="flex justify-center items-center h-[300px] w-full mb-10">
            <h1 className="font-Playwrite text-[40px] sm:text-[50px] md:text-[70px] text-[#5c4327] font-semibold opacity-50 text-center">
              {rooms.length === 0
                ? "No rooms available."
                : "No rooms match your filter."}
            </h1>
          </div>
        )}

        {/* Rooms Grid */}
        {paginatedRooms.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-0">
            {paginatedRooms.map((room) => (
              <div
                key={room.id}
                className="relative bg-white rounded-3xl shadow-xl overflow-visible transform hover:scale-105 transition-all duration-300 flex flex-col hover:z-50 min-h-[400px]"
              >
                <div className="overflow-hidden h-52 rounded-t-3xl">
                  <img
                    src={room.images?.[0]}
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
                  <p className="text-[#7a664b] text-sm">
                    <FaCheck className="inline text-[#b08968] mr-1" />
                    Suitable for {room.capacity}{" "}
                    {room.capacity > 1 ? "guests" : "guest"}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <p
                      className={`font-semibold ${
                        room.available ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {room.available ? "Available Now" : "Not Available"}
                    </p>
                    <button
                      onClick={() => navigate(`/room/${room.id}`)}
                      className="bg-[#b08968] hover:bg-[#a07652] text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-md"
                    >
                      View Details
                    </button>
                  </div>
                </div>
                <div
                  className={`absolute top-5 right-5 px-3 py-1 rounded-full text-sm font-medium ${
                    room.available
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {room.available ? "Ready to Book" : "Occupied"}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredRooms.length > pageSize && (
          <div className="flex justify-center mt-10">
            <Pagination
              count={Math.ceil(filteredRooms.length / pageSize)}
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
                  "&:hover": { backgroundColor: "#a07652" },
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
