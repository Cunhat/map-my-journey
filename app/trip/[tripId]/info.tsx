import { Button } from "@/components/ui/button";
import { FullPageLoading } from "@/components/ui/loading";
import { supabaseClient } from "@/lib/supabase";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useGlobalSearchParams } from "expo-router";
import { CalendarDays, Plane, Save, Trash2 } from "lucide-react-native";
import React, { useEffect, useMemo } from "react";
import { SafeAreaView, Text, TextInput, View } from "react-native";
import CountriesJson from "@/assets/data/countries.json";

const Info = () => {
  const [name, setName] = React.useState("");
  const [days, setDays] = React.useState<"" | number>(0);
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
        .select("*, point(*)")
        .eq("id", tripId)
        .maybeSingle();

      console.log(resp);

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
      const token = await getToken({ template: "routes-app-supabase" });

      const supabase = await supabaseClient(token);

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

  const countries = useMemo(() => {
    const allCountries = new Set<string>();
    data?.point?.forEach((point) => {
      const country = point.name.split(",");

      allCountries.add(country[country.length - 1].replaceAll(" ", ""));
    });
    return Array.from(allCountries);
  }, [data]);

  if (isPending) return <FullPageLoading />;

  const validDaysChange = days !== "" && days < (data?.days ?? 999);

  const isDirty = () => {
    return (name === data?.name && days == data?.days) || validDaysChange;
  };

  return (
    <SafeAreaView className="flex-1 bg-white ">
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
              {validDaysChange && (
                <Text className="text-red-500">
                  You can't change the number of days if you have points added
                </Text>
              )}
            </View>
          </View>
          <View style={{ gap: 12 }}>
            <Text className="text-sky-500 pl-3 text-xl">Trip Info</Text>
            <View>
              <View className="flex flex-row justify-between p-6 border-b border-t border-gray-200">
                <Text className="text-gray-500 text-base">
                  Number of points:
                </Text>
                <Text className="text-gray-500 text-base">
                  {data?.point?.length}
                </Text>
              </View>
              <View className="flex flex-row justify-between p-6 border-b border-t border-gray-200">
                <Text className="text-gray-500 text-base">Countries:</Text>
                <Text className="text-gray-500 text-base">
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
                </Text>
              </View>
            </View>
          </View>
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
