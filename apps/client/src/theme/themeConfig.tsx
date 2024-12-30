import { type ThemeConfig } from "antd";

const themeConfig: ThemeConfig = {
  token: {
    fontSize: 14,
    colorPrimary: "#FF7700",
    colorText: "#070707",
  },
  components: {
    Layout: {
      siderBg: "#013B5A",
    },
    Menu: {
      itemActiveBg: "#013B5A",
      itemBg: "#013B5A",
      itemColor: "#F7F7F7",
      itemHoverBg: "#017DC0",
      itemHoverColor: "#F7F7F7",
      itemSelectedColor: "#00B5E8",
      itemSelectedBg: "#EFF7F8",
      colorBgElevated: "#013B5A",
    },
    Descriptions: {
      labelBg: "#015E9017",
      lineWidth: 2,
    },
    Table: {
      rowHoverBg: "#DFEBF2",
      headerBg: "#DFEBF2",
      lineWidth: 1.3,
    },
    Card: {
      headerBg: "#013B5A22",
    },
    Switch: {
      colorPrimary: "#1D8348",
      colorTextLightSolid: "#F7F7F7",
      colorTextQuaternary: "#8C1111",
      colorTextTertiary: "#A7BAB7",
      colorPrimaryHover: "#3F97AF",
    },
  },
};

export default themeConfig;
