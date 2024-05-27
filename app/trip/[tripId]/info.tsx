import { Button } from "@/components/ui/button";
import { FullPageLoading } from "@/components/ui/loading";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  router,
  useGlobalSearchParams,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import {
  CalendarDays,
  MapPin,
  Pin,
  Plane,
  Save,
  Trash,
  Trash2,
} from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { View, Text, SafeAreaView, TextInput } from "react-native";
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";

const Info = () => {
  const [name, setName] = React.useState("");
  const [days, setDays] = React.useState<"" | number>(0);
  // const [city, setCity] = React.useState<
  //   | {
  //       name: string;
  //       latitude: number;
  //       longitude: number;
  //     }
  //   | undefined
  // >();
  const { tripId } = useGlobalSearchParams<{ tripId: string }>();
  const { getToken, userId, isLoaded } = useAuth();
  const queryClient = useQueryClient();

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["getTrip", tripId],
    queryFn: async () => {
      const token = await getToken({ template: "routes-app-supabase" });

      const supabase = await supabaseClient(token);
      const resp = await supabase
        .from("trip")
        .select("*")
        .eq("id", tripId)
        .maybeSingle();

      return resp.data;
    },
  });

  useEffect(() => {
    if (isSuccess && data) {
      setName(data.name);
      setDays(data.days);
    }
  }, [isSuccess]);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const resp = await supabase
        .from("trip")
        .delete()
        .eq("id", tripId)
        .select();

      console.log(resp);
      return resp;
    },

    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["getTrips"],
      });
      router.push("/(home)/");
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (newTrip: any) => {
      return await supabase
        .from("trip")
        .update({
          ...newTrip,
        })
        .eq("id", tripId)
        .select();
    },

    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["getTrip", tripId],
      });
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  if (isPending) return <FullPageLoading />;

  const validDaysChange = days !== "" && days < (data?.days ?? 999);

  const isDirty = () => {
    return (name === data?.name && days == data?.days) || validDaysChange;
  };

  return (
    <SafeAreaView className="flex-1 bg-white ">
      <View className="flex-1 p-3 justify-between">
        <View style={{ gap: 12 }}>
          <View className="relative">
            <Plane
              className="text-gray-500 absolute z-10 left-1.5 top-3.5 "
              height={20}
              width={20}
            />
            <TextInput
              placeholder={"What is the name of your trip?"}
              placeholderTextColor={"#d1d5db"}
              value={name}
              style={{ paddingLeft: 35 }}
              onChangeText={(text) => setName(text)}
              className="h-11 w-full text-base p-2 bg-gray-100 rounded-xl text-gray-600"
            />
          </View>
          <View className="relative">
            <CalendarDays
              className="text-gray-500 absolute z-10 left-1.5 top-3.5 "
              height={20}
              width={20}
            />
            <TextInput
              placeholder={"How many days will you be there?"}
              placeholderTextColor={"#d1d5db"}
              value={days.toString()}
              style={{ paddingLeft: 35 }}
              keyboardType={"number-pad"}
              onChangeText={(text) => {
                console.log(typeof text);
                setDays(text !== "" ? parseInt(text) : "");
              }}
              className="h-11 w-full text-base p-2 bg-gray-100 rounded-xl text-gray-600 "
            />
            {validDaysChange && (
              <Text className="text-red-500">
                You can't change the number of days if you have points added
              </Text>
            )}
          </View>

          {/* <MapPin
              className="text-gray-500 absolute z-10 left-1.5 top-3.5 "
              height={20}
              width={20}
            />
            <TextInput
              placeholder={"How many days will you be there?"}
              placeholderTextColor={"#d1d5db"}
              value={data?.city ?? ""}
              style={{ paddingLeft: 35 }}
              keyboardType={"number-pad"}
              // onChangeText={(text) => setDays(text)}
              className="h-11 w-full text-base p-2 bg-gray-100 rounded-xl text-gray-600  "
            /> */}
        </View>
        <View style={{ gap: 12 }}>
          {!isDirty() && (
            <Button
              title="Save"
              icon={<Save className="text-white" height={20} width={20} />}
              fullWidth
              onPress={() => updateMutation.mutate({ name: name, days: days })}
            />
          )}
          <Button
            title="Delete"
            type="danger"
            icon={<Trash2 className="text-white" height={20} width={20} />}
            fullWidth
            onPress={() => deleteMutation.mutate()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Info;
