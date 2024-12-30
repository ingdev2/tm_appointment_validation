"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import CustomButton from "@/components/common/custom_button/CustomButton";
import { setIdNumberUser } from "@/redux/features/user/userSlice";
import { Space } from "antd";

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();

  let idNumberUserState = useAppSelector((state) => state.user.id_number);

  return (
    <div
      className="home-page"
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexFlow: "column wrap",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Space size={"middle"} direction="vertical" align="center">
        <h2>Prueba de Ant Design y Redux Toolkit</h2>

        <h4>Número de identificación Usuario: {idNumberUserState}</h4>

        <Space size={"middle"}>
          <CustomButton
            titleCustomButton="Reducir"
            typeCustomButton="primary"
            sizeCustomButton="middle"
            styleCustomButton={{ backgroundColor: "red" }}
            onClickCustomButton={() => {
              dispatch(setIdNumberUser((idNumberUserState -= 1)));
            }}
          />

          <CustomButton
            titleCustomButton="Aumentar"
            typeCustomButton="primary"
            sizeCustomButton="middle"
            styleCustomButton={{ backgroundColor: "green" }}
            onClickCustomButton={() => {
              dispatch(setIdNumberUser((idNumberUserState += 1)));
            }}
          />
        </Space>
      </Space>
    </div>
  );
};

export default HomePage;
