"use client";

import React from "react";
import { useAppDispatch } from "@/redux/hooks";

import { Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { titleStyleCss } from "@/theme/text_styles";
import { FcPlus } from "react-icons/fc";
import { RcFile, UploadChangeParam } from "antd/es/upload";

import { getBufferFromFile } from "@/helpers/get_buffer_from_file/get_buffer_from_file";

const CustomUpload: React.FC<{
  titleCustomUpload: string;
  fileStatusSetterCustomUpload: React.SetStateAction<any>;
  removeFileStatusSetterCustomUpload: React.SetStateAction<any>;
  maximumNumberOfFiles: number;
  maximumSizeFilesInMegaBytes: number;
}> = ({
  titleCustomUpload,
  fileStatusSetterCustomUpload,
  removeFileStatusSetterCustomUpload,
  maximumNumberOfFiles,
  maximumSizeFilesInMegaBytes,
}) => {
  const dispatch = useAppDispatch();

  const handleChange = async (info: UploadChangeParam<UploadFile<any>>) => {
    const files = await Promise.all(
      info.fileList.map(async (file: UploadFile) => {
        const buffer = await getBufferFromFile(file);

        return {
          originalname: file.name,
          mimetype: file.type,
          size: file.size,
          buffer: buffer,
        } as Express.Multer.File;
      })
    );

    if (info.file.status === "done") {
      message.success(`¡Documento ${info.file.name} cargado correctamente!`);

      dispatch(fileStatusSetterCustomUpload(files));
    }
    if (info.file.status === "removed") {
      message.warning(`¡Documento ${info.file.name} removido correctamente!`);

      dispatch(removeFileStatusSetterCustomUpload(info.file.name));
    } else if (info.file.status === "error") {
      message.error(`¡Error al cargar documento ${info.file.name}!`);
    }
  };

  const props: UploadProps = {
    name: "files",
    multiple: true,
    maxCount: maximumNumberOfFiles,
    accept: process.env.NEXT_PUBLIC_FILE_TYPES_ALLOWED,
    listType: "text",
    beforeUpload: (file: RcFile) => {
      const allowedTypes = process.env.NEXT_PUBLIC_SUPPORTED_FILE_FORMATS;

      if (allowedTypes && !allowedTypes.includes(file.type)) {
        message.error(
          `¡El archivo ${file.name} no es un formato Excel válido!`
        );

        return Upload.LIST_IGNORE;
      }

      const isLt2M = file.size / 1024 / 1024 < maximumSizeFilesInMegaBytes;

      if (!isLt2M) {
        message.error(
          `¡El peso del archivo debe ser menor a ${maximumSizeFilesInMegaBytes}MB!`
        );

        return Upload.LIST_IGNORE;
      }

      return true;
    },
    progress: {
      strokeColor: {
        "0%": "#8C1111",
        "100%": "#137A2B",
      },
      size: 7,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    onDrop(e) {},
  };

  return (
    <Upload.Dragger
      {...props}
      onChange={handleChange}
      style={{ margin: "7px 0px" }}
    >
      <div
        style={{
          ...titleStyleCss,
          display: "flex",
          flexFlow: "column wrap",
          alignItems: "center",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        {<FcPlus size={27} />}
        {titleCustomUpload}
      </div>
    </Upload.Dragger>
  );
};

export default CustomUpload;
