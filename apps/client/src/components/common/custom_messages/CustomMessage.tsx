"use client";

import React, { useEffect } from "react";

import { message as messageAntd } from "antd";
import { NoticeType } from "antd/es/message/interface";

const CustomMessage: React.FC<{ message: string; typeMessage: NoticeType }> = ({
  message,
  typeMessage,
}) => {
  useEffect(() => {
    if (message) {
      const template = messageAntd.open({
        type: typeMessage,
        content: message,
        duration: 5,
        style: { fontSize: 17, marginTop: "2vh" },
      });

      return () => {
        template();
      };
    }
  }, [message, typeMessage]);

  return null;
};

export default CustomMessage;
