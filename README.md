# Velora Hotel

A **Hotel Reservation System** built using modern web technologies to provide a smooth and user-friendly booking experience.

---

## Project Overview

Velora Hotel enables users to:

- Browse and filter hotel rooms
- View detailed room information
- Make and manage reservations
- Smooth login/signup experience with authentication state handled in Redux

The app is fully responsive with elegant animations and alerts.

---

## Technologies Used

### Frontend

- **React.js**
- **Redux Toolkit** (State Management)
- **Axios**
- **Framer Motion**
- **React Date Range**
- **Swiper.js**
- **React Icons**
- **React Toastify**
- **SweetAlert2**
- **DotLoader**

### Backend

- **MockAPI** for API data handling

### Deployment

- **Vercel**

---

## Authentication

### **Login Page**

- Email & password input validation
- Error/success alerts using **Toastify**
- Successful login saves user data in **Redux**
- Animated welcome screen using **Framer Motion**

### **Signup Page**

- Fields: Username, Email, Password, Confirm Password
- Validation for:
  - Non‑empty inputs
  - Password length
  - Password match
- Redirect to Login after success ✅

---

## Pages & Features

### Home Page

- Fetch rooms from **MockAPI**
- Display rooms in responsive **Grid**
- Filtering by:
  - Room type (Single / Double / Suite)
  - Price range
- Sorting by price (Low → High / High → Low)
- **Pagination** to improve browsing experience
- Room card includes:
  - Image
  - Type
  - Capacity
  - Price
  - Availability status
  - Button → View Details
- Uses **Toastify** for errors + **DotLoader** while fetching

---

### Dashboard Page

- Shows active bookings of current logged user
- Filtering bookings where `checkOut > Today`
- Room details shown within booking:
  - Image, name, type, price, dates
- **Booking cancellation** with confirmation via **SweetAlert2**
- Pagination + Loader + Empty state

---

### Navbar Component

- Logo redirects to Home
- Dynamic navigation based on authentication:
  - Logged in → Home, Dashboard + Profile Dropdown (with Logout)
  - Guest → Home, Login, Sign Up
- Fully responsive:
  - Desktop → Inline menu
  - Mobile → Dropdown sliding menu
- Beautiful effects: hover, transitions, scaling, shadow, gradient

---

### Room Details Page

- Fetch room data + bookings based on ID from URL
- **Image Gallery using Swiper**
  - Pagination
  - Navigation controls
  - Hover effects
  - Autoplay
- Room information:
  - Name, description, price, type, capacity, amenities
- **Booking System**
  - Date selection using **react‑date‑range**
  - Disabled booked dates
  - Conflict check before reservation
  - If logged in → Book Now modal
  - If guest → Request login with redirect
  - After success → Add booking + redirect to Dashboard
- Show **DotLoader** during fetching
- 404 fallback if no room found

---

## Installation & Usage

```bash
# Clone the repo
git clone https://github.com/mohand-ashraf/velora-hotel

# Navigate to project folder
cd velora-hotel

# Install dependencies
npm install

# Run the project locally
npm start
```

---

## Live Demo

https://velora-hotel.vercel.app/

---

## GitHub Repository

https://github.com/mohand-ashraf/velora-hotel

---

## Status

Project Completed ✅  
Future Updates May Include:

- Full Authentication with backend
- Admin Dashboard
- Online payment integration
- Multilingual support

---

## Developed By

**Mohand Ashraf**
