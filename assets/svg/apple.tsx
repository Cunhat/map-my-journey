import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Apple = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <Path
      fill="#fff"
      d="M10.167 3.242c.435-.523.742-1.24.742-1.958a1.12 1.12 0 0 0-.03-.284c-.704.03-1.55.47-2.06 1.069-.397.448-.772 1.173-.772 1.891 0 .112.023.217.03.254.045.008.12.015.188.015.636 0 1.43-.419 1.902-.987zm.495 1.144c-1.057 0-1.918.643-2.465.643-.591 0-1.355-.606-2.284-.606C4.168 4.423 2.4 5.866 2.4 8.58c0 1.697.652 3.49 1.46 4.642C4.557 14.193 5.164 15 6.04 15c.869 0 1.251-.575 2.33-.575 1.093 0 1.333.56 2.292.56.95 0 1.587-.867 2.18-1.727.673-.986.95-1.943.958-1.988-.053-.015-1.873-.755-1.873-2.833 0-1.794 1.431-2.6 1.513-2.66-.943-1.354-2.381-1.391-2.778-1.391z"
    />
  </Svg>
);
export default Apple;