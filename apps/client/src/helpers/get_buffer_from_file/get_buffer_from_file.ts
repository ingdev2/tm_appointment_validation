import { UploadFile } from "antd";

export const getBufferFromFile = (file: UploadFile): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      resolve(Buffer.from(arrayBuffer));
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file.originFileObj as Blob);
  });
};
