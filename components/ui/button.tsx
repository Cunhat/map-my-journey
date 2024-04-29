import { cva } from "class-variance-authority";
import React from "react";
import { TouchableOpacity, Text } from "react-native";

type ButtonProps = {
  title: string;
  type?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
  onPress?: () => void;
  disabled?: boolean;
};

const buttonStyle = cva(
  "inline-flex items-center justify-center h-12 px-4 py-2 rounded-2xl text-lg font-medium",
  {
    variants: {
      type: {
        primary: "bg-sky-500 text-white",
        secondary: "bg-white border border-sky-500 text-sky-500",
        danger: "bg-red-500",
      },
      fullWidth: {
        true: "w-full",
        false: "w-fit-content",
      },
      disabled: {
        true: "opacity-50",
      },
    },
    defaultVariants: {
      type: "primary",
      fullWidth: false,
    },
  }
);

const textStyles = cva("text-lg font-medium", {
  variants: {
    type: {
      primary: "text-white",
      secondary: "text-sky-500",
      danger: "text-white",
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
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      className={buttonStyle({ type, fullWidth, disabled })}
    >
      <Text className={textStyles({ type })}>{title}</Text>
    </TouchableOpacity>
  );
};
