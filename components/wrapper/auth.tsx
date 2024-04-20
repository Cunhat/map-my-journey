import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import React, { PropsWithChildren } from "react";
import { Text } from "react-native";

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { data, isPending, error } = useAuth();

  if (isPending) return <Text>Loading...</Text>;

  if (!data?.data.session) router.push("/(auth)/signIn");

  return <>{children}</>;
};

export default AuthProvider;
