import CountriesJson from "@/assets/data/countries.json";
import { Button } from "@/components/ui/button";
import { InfoField, InfoFieldSeparator } from "@/components/ui/info-field";
import { FullPageLoading } from "@/components/ui/loading";
import { supabaseClient } from "@/lib/supabase";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useGlobalSearchParams } from "expo-router";
import {
  CalendarDays,
  Map,
  MapPin,
  MapPinOff,
  Plane,
  Save,
  Trash2,
  TriangleAlert,
} from "lucide-react-native";
import React, { useEffect, useMemo } from "react";
import {
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const Info = () => {
  const [name, setName] = React.useState("");
  const [days, setDays] = React.useState<"" | number>(0);
  const { tripId } = useGlobalSearchParams<{ tripId: string }>();
  const { getToken, isLoaded } = useAuth();
  const queryClient = useQueryClient();

  const { data, isPending, isSuccess, isLoading, isFetching } = useQuery({
    queryKey: ["getTrip", tripId],
    queryFn: async () => {
      const token = await getToken({ template: "routes-app-supabase" });

      const supabase = await supabaseClient(token);

      const resp = await supabase
        .from("trip")
        .select("*, point(*)")
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
      const token = await getToken({ template: "routes-app-supabase" });

      const supabase = await supabaseClient(token);

      const resp = await supabase
        .from("trip")
        .delete()
        .eq("id", tripId)
        .select();

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
      const token = await getToken({ template: "routes-app-supabase" });

      const supabase = await supabaseClient(token);

      const resp = await supabase
        .from("trip")
        .update({
          ...newTrip,
        })
        .eq("id", tripId)
        .select();

      if (resp.status === 200) {
        const deletePoints = await supabase
          .from("point")
          .delete()
          .eq("trip_id", tripId)
          .gt("day", newTrip.days)
          .select();
      }

      return resp;
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

  const countries = useMemo(() => {
    const allCountries = new Set<string>();

    const city = data?.city?.split(",");
    if (city?.length)
      allCountries.add(city[city.length - 1].replaceAll(" ", ""));

    data?.point?.forEach((point) => {
      const country = point.name.split(",");

      allCountries.add(country[country.length - 1].replaceAll(" ", ""));
    });
    return Array.from(allCountries);
  }, [data]);

  if (isFetching) return <FullPageLoading />;

  const isDirty = () => {
    return name === data?.name && days == data?.days;
  };

  return (
    <SafeAreaView className="flex-1 bg-white ">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ gap: 12 }} className="flex-1 justify-between">
          <View style={{ gap: 12 }}>
            <View style={{ gap: 12 }} className="p-3">
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
                    setDays(text !== "" ? parseInt(text) : "");
                  }}
                  className="h-11 w-full text-base p-2 bg-gray-100 rounded-xl text-gray-600 "
                />
                {days !== "" && days < (data?.days ?? 999) && (
                  <View
                    style={{ gap: 8 }}
                    className="flex-row items-center justify-center px-4"
                  >
                    <TriangleAlert
                      className="text-red-500"
                      height={20}
                      width={20}
                    />
                    <Text className="text-red-500 text-xs">
                      You are decreasing the number of days, you may lose some
                      created points!
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View style={{ gap: 12 }}>
              <Text className="text-sky-500 pl-3 text-xl">Trip Info</Text>
              <View>
                <InfoFieldSeparator />
                <InfoField
                  icon={
                    <MapPin className="text-red-500" height={20} width={20} />
                  }
                  label="Number of points:"
                  value={data?.point?.length ?? 0}
                />
                <InfoFieldSeparator />
                <InfoField
                  icon={
                    <MapPinOff
                      className="text-green-500"
                      height={20}
                      width={20}
                    />
                  }
                  label="Number of visited points:"
                  value={data?.point?.reduce(
                    (acc, cur) => acc + (cur.visited ? 1 : 0),
                    0
                  )}
                />
                <InfoFieldSeparator />
                <InfoField
                  icon={
                    <Map className="text-yellow-500" height={20} width={20} />
                  }
                  label="Countries:"
                  value={
                    <View className="flex flex-row" style={{ gap: 8 }}>
                      {countries.map((country) => {
                        const ctr = CountriesJson.find(
                          (elem) => elem.name === country
                        );

                        return (
                          <View
                            key={country}
                            className="flex items-center flex-row border border-gray-400 rounded-full px-2"
                            style={{ gap: 4 }}
                          >
                            {ctr && ctr.flag && (
                              <Text className="text-xl text-gray-500">
                                {ctr.flag}
                              </Text>
                            )}
                            <Text>{ctr?.name}</Text>
                          </View>
                        );
                      })}
                    </View>
                  }
                />
                <InfoFieldSeparator />
              </View>
            </View>
          </View>
          <View style={{ gap: 12 }} className="p-3">
            {!isDirty() && (
              <Button
                title="Save"
                icon={<Save className="text-white" height={20} width={20} />}
                fullWidth
                onPress={() =>
                  updateMutation.mutate({ name: name, days: days })
                }
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
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Info;
