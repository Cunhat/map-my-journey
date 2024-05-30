import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: style */
const Facebook = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    id="Shopicons"
    width={800}
    height={800}
    x={0}
    y={0}
    fill="#fff"
    stroke="#fff"
    viewBox="0 0 48 48"
    {...props}
  >
    <G id="SVGRepo_iconCarrier">
      <G id="facebook_00000036941523553350469640000009414394758112222367_">
        <Path d="M24 4C12.954 4 4 12.954 4 24c0 10.37 7.894 18.895 18 19.899V28h-5v-4h5v-3c0-3.309 2.691-6 6-6h3v4h-3c-1.103 0-2 .897-2 2v3h5v4h-5v15.899C36.106 42.895 44 34.37 44 24c0-11.046-8.954-20-20-20z" />
      </G>
    </G>
  </Svg>
);
export default Facebook;
