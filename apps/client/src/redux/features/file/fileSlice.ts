import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Ifiles = {
  files: [],
};

export const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    setFile: (state, action: PayloadAction<Array<Express.Multer.File>>) => {
      state.files = action.payload;
    },
    removeFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter(
        (file) => file.originalname !== action.payload
      );
    },
  },
});

export const { setFile, removeFile } = fileSlice.actions;

export default fileSlice.reducer;
