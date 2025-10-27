import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchRooms = createAsyncThunk("rooms/fetchRooms", async () => {
  const response = await fetch("https://68ff71e3e02b16d1753dfced.mockapi.io/api/vi/rooms");
  const data = await response.json();
  return data;
});

const roomsSlice = createSlice({
  name: "rooms",
  initialState: {
    rooms: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default roomsSlice.reducer;
