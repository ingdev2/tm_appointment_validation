"use client";

import React, { useState } from "react";
import { useAppSelector } from "@/redux/hooks";

import { Col, Row, Tabs, Table, Alert, Divider } from "antd";
import CustomUpload from "@/components/common/custom_upload/CustomUpload";
import CustomButton from "@/components/common/custom_button/CustomButton";
import CustomMessage from "@/components/common/custom_messages/CustomMessage";
import { titleStyleCss } from "../../theme/text_styles";
import { FcInfo } from "react-icons/fc";

import { setFile, removeFile } from "@/redux/features/file/fileSlice";

import { useCompareFilesMutation } from "@/redux/apis/upload_files/uploadFilesApi";

import {
  columnsCoco,
  columnsCoincidences,
  columnsHosvital,
} from "@/helpers/excel_file_columns/excel_file_columns";
import CustomTableFiltersAndSorting from "@/components/common/custom_table_filters_and_sorting/CustomTableFiltersAndSorting";

const HomePage: React.FC = () => {
  const [results, setResults] = useState<{
    coincidencias: IExcelRows[];
    soloEnHO: IExcelRowsHosvital[];
    soloEnCO: IExcelRowsCoco[];
  } | null>(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const filesState = useAppSelector((state) => state.file.files);

  const [uploadFiles] = useCompareFilesMutation({
    fixedCacheKey: "uploadFilesData",
  });

  const handleCompareFiles = async () => {
    if (filesState.length !== 2) {
      setErrorMessage("Debes subir los 2 archivos a comparar");
      setShowErrorMessage(true);
      return;
    }

    try {
      const formData = new FormData();

      filesState.forEach((file) => {
        formData.append(
          "files",
          new Blob([file.buffer], { type: file.mimetype }),
          file.originalname
        );
      });

      const response: any = await uploadFiles(formData);

      if (response?.data) {
        setResults(response.data);
        setSuccessMessage("¡Archivos procesados correctamente!");
        setShowSuccessMessage(true);
      }
      if (response?.error) {
        setErrorMessage(response?.error?.data?.message);
        setShowErrorMessage(true);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Error al procesar los archivos. Por favor, inténtalo de nuevo."
      );
      setShowErrorMessage(true);
    }
  };

  const handleButtonClick = () => {
    setSuccessMessage("");
    setShowSuccessMessage(false);
    setErrorMessage("");
    setShowErrorMessage(false);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexFlow: "column wrap",
        alignItems: "center",
        paddingBlock: "22px",
      }}
    >
      {showErrorMessage && (
        <CustomMessage
          typeMessage="error"
          message={errorMessage || "¡Error en la petición!"}
        />
      )}

      {showSuccessMessage && (
        <CustomMessage
          typeMessage="success"
          message={successMessage || "¡Documentos subidos correctamente!"}
        />
      )}

      <Row
        gutter={24}
        align={"top"}
        justify={"center"}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <Col span={12} style={{ textAlign: "center" }}>
          <h2 style={{ ...titleStyleCss, paddingBottom: "13px" }}>
            Comparar Documentos
          </h2>

          <CustomUpload
            titleCustomUpload="Subir Archivos"
            fileStatusSetterCustomUpload={setFile}
            removeFileStatusSetterCustomUpload={removeFile}
            maximumNumberOfFiles={Number(
              process.env.NEXT_PUBLIC_MAXIMUM_NUMBER_OF_FILES
            )}
            maximumSizeFilesInMegaBytes={Number(
              process.env.NEXT_PUBLIC_MAXIMUM_FILE_SIZE_IN_MEGABYTES
            )}
          />
        </Col>

        <Col span={24} style={{ textAlign: "center", paddingTop: "13px" }}>
          <CustomButton
            titleCustomButton="Comparar Archivos"
            typeCustomButton="primary"
            sizeCustomButton="large"
            styleCustomButton={{
              borderRadius: "22px",
              paddingInline: "31px",
            }}
            onClickCustomButton={handleCompareFiles}
            onMouseDownCustomButton={handleButtonClick}
            disabledCustomButton={filesState.length !== 2}
          />
        </Col>

        {results && (
          <Col
            span={20}
            style={{
              display: "flex",
              flexFlow: "column wrap",
              paddingBlock: "22px",
            }}
          >
            <Alert
              type="info"
              style={{
                textAlign: "center",
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
              message={
                <div
                  style={{
                    display: "flex",
                    flexFlow: "row wrap",
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FcInfo size={"31px"} />
                  <h3
                    style={{
                      ...titleStyleCss,
                      margin: "0px",
                      paddingInline: "13px",
                    }}
                  >
                    Resumen de Comparación
                  </h3>
                </div>
              }
              description={
                <p style={{ fontSize: "17px" }}>
                  Coincidencias: <b>{results.coincidencias.length}</b> | Solo en
                  Hosvital: <b>{results.soloEnHO.length}</b> | Solo en Coco:
                  <b>{results.soloEnCO.length}</b>
                </p>
              }
            />

            <Divider />

            <Tabs
              defaultActiveKey="1"
              type="card"
              centered
              tabBarGutter={13}
              tabBarStyle={{ marginBottom: 13 }}
              style={{
                display: "flex",
                flexFlow: "column wrap",
                justifyContent: "center",
              }}
              items={[
                {
                  className: "coindidences",
                  key: "1",
                  label: "Coincidencias",
                  children: (
                    <CustomTableFiltersAndSorting
                      dataCustomTable={results.coincidencias || []}
                      columnsCustomTable={columnsCoincidences}
                    />
                  ),
                },
                {
                  className: "hosvital",
                  key: "2",
                  label: "Solo en Hosvital",
                  children: (
                    <CustomTableFiltersAndSorting
                      dataCustomTable={results.soloEnHO || []}
                      columnsCustomTable={columnsHosvital}
                    />
                  ),
                },
                {
                  className: "coco",
                  key: "3",
                  label: "Solo en Coco",
                  children: (
                    <CustomTableFiltersAndSorting
                      dataCustomTable={results.soloEnCO || []}
                      columnsCustomTable={columnsCoco}
                    />
                  ),
                },
              ]}
            />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default HomePage;
