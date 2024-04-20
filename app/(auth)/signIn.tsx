import { Button } from "@/components/ui/button";
import { CustomTextInput } from "@/components/ui/text-input";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  AppState,
  SafeAreaView,
  Text,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { Redirect, router } from "expo-router";
import { useAuth } from "@/provider/authProvider";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { session, isLoading } = useAuth();

  if (session) return <Redirect href={"/"} />;

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);

    router.push("/");
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <SafeAreaView className="flex-1">
      <View style={{ gap: 24 }} className="flex-1 p-3">
        <View>
          <CustomTextInput
            label="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={"none"}
          />
        </View>
        <View>
          <CustomTextInput
            label="Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={"none"}
          />
        </View>
        <View>
          <Button
            title="Sign in"
            disabled={loading}
            onPress={() => signInWithEmail()}
          />
        </View>
        <View>
          <Button
            title="Sign up"
            //   disabled={loading}
            onPress={() => signUpWithEmail()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
