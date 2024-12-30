import { createSlice } from "@reduxjs/toolkit";

const initialState: User = {
  id: "",
  name: "",
  last_name: "",
  id_number: 0,
  birthdate: "",
  email: "",
  cellphone: 0,
  password: "",
  residence_department: "",
  residence_city: "",
  residence_address: "",
  residence_neighborhood: "",
  is_active: true,
  createdAt: "",
  updateAt: "",
  deletedAt: "",
  errors: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIdUser: (state, action) => {
      state.id = action.payload;
    },
    setNameUser: (state, action) => {
      state.name = action.payload;
    },
    setLastNameUser: (state, action) => {
      state.last_name = action.payload;
    },
    setIdNumberUser: (state, action) => {
      state.id_number = action.payload;
    },
    setBirthdateUser: (state, action) => {
      state.birthdate = action.payload;
    },
    setEmailUser: (state, action) => {
      state.email = action.payload;
    },
    setCellphoneUser: (state, action) => {
      state.cellphone = action.payload;
    },
    setPasswordUser: (state, action) => {
      state.password = action.payload;
    },
    setResidenceDepartmentUser: (state, action) => {
      state.residence_department = action.payload;
    },
    setResidenceCityUser: (state, action) => {
      state.residence_city = action.payload;
    },
    setResidenceAddressUser: (state, action) => {
      state.residence_address = action.payload;
    },
    setResidenceNeighborhoodUser: (state, action) => {
      state.residence_neighborhood = action.payload;
    },
    setIsActiveUser: (state, action) => {
      state.is_active = action.payload;
    },
    setErrorsUser: (state, action) => {
      state.errors = action.payload;
    },
    setDefaultValuesUser: (state) => {
      state.id = "";
      state.name = "";
      state.last_name = "";
      state.id_number = 0;
      state.birthdate = "";
      state.email = "";
      state.cellphone = 0;
      state.password = "";
      state.residence_department = "";
      state.residence_city = "";
      state.residence_address = "";
      state.residence_neighborhood = "";
      state.errors = [];
    },
  },
});

export const {
  setIdUser,
  setNameUser,
  setLastNameUser,
  setIdNumberUser,
  setBirthdateUser,
  setEmailUser,
  setCellphoneUser,
  setPasswordUser,
  setResidenceDepartmentUser,
  setResidenceCityUser,
  setResidenceAddressUser,
  setResidenceNeighborhoodUser,
  setIsActiveUser,
  setErrorsUser,
  setDefaultValuesUser,
} = userSlice.actions;

export default userSlice.reducer;
