import { cva } from "class-variance-authority";
import React, { ReactNode } from "react";
import { TouchableOpacity, Text } from "react-native";

type ButtonProps = {
  title: string;
  type?: "primary" | "secondary" | "danger" | "success";
  fullWidth?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
};

const buttonStyle = cva(
  "flex-row items-center justify-center h-12 px-4 py-2 rounded-2xl text-lg font-medium",
  {
    variants: {
      type: {
        primary: "bg-sky-500 text-white",
        secondary: "bg-white border border-sky-500 text-sky-500",
        danger: "bg-red-500",
        success: "bg-green-600",
      },
      fullWidth: {
        true: "w-full",
        false: "w-fit-content",
      },
      disabled: {
        true: "bg-sky-300",
      },
    },
    defaultVariants: {
      type: "primary",
      fullWidth: false,
    },
  }
);

const textStyles = cva("text-lg font-medium ", {
  variants: {
    type: {
      primary: "text-white",
      secondary: "text-sky-500",
      danger: "text-white",
      success: "text-white",
    },
  },
  defaultVariants: {
    type: "primary",
  },
});

export const Button: React.FC<ButtonProps> = ({
  title,
  type,
  fullWidth,
  onPress,
  disabled,
  icon,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{ gap: 6 }}
      className={buttonStyle({ type, fullWidth, disabled })}
    >
      {icon}
      <Text className={textStyles({ type })}>{title}</Text>
    </TouchableOpacity>
  );
};
