import { HomeLayout } from "@/components/home-layout";
import { PlacePhoto } from "@/components/place-photo";
import { Button } from "@/components/ui/button";
import { CalendarBottomSheet } from "@/components/ui/calendar-bottom-sheet";
import { CustomTextInput } from "@/components/ui/text-input";
import { supabaseClient } from "@/lib/supabase";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { router, useNavigation } from "expo-router";
import { CalendarDays, MapPin, Plane, X } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";

type Photos = {
  height: number;
  html_attributions: Array<string>;
  photo_reference: string;
  width: number;
};

const NewTrip = () => {
  const [name, setName] = React.useState("");
  const [city, setCity] = React.useState<
    | {
        name: string;
        latitude: number;
        longitude: number;
        photos: Array<Photos>;
      }
    | undefined
  >();
  const [photo, setPhoto] = React.useState<string>();
  const ref = useRef<GooglePlacesAutocompleteRef>(null);
  const { getToken, userId, isLoaded } = useAuth();
  const [date, setDate] = React.useState<{
    startDate: string | undefined;
    endDate: string | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
  });

  const queryClient = useQueryClient();

  const createTripMutation = useMutation({
    mutationFn: async (newTrip: any) => {
      const token = await getToken({ template: "routes-app-supabase" });

      const supabase = await supabaseClient(token!);

      return await supabase
        .from("trip")
        .insert([
          {
            name: newTrip.name,
            start_date: dayjs(newTrip.date.startDate).utc(true).toString(),
            end_date: dayjs(newTrip.date.endDate).utc(true).toString(),
            user_id: userId,
            city: newTrip.city.name,
            latitude: newTrip.city.latitude,
            longitude: newTrip.city.longitude,
            photo_url: newTrip.photo,
          },
        ])
        .select();
    },

    onSuccess: ({ data }) => {
      if (data && data[0]?.id) {
        setCity(undefined);
        setName("");
        ref.current?.clear();
        setPhoto(undefined);
        queryClient.invalidateQueries({ queryKey: ["getTrips"] });
        router.navigate("/trip/" + data[0].id);
      }
    },
    onError: (err) => {
      console.log("err", err);
    },
  });

  const onSubmit = () => {
    createTripMutation.mutate({
      name,
      date,
      city,
      photo,
    });
  };

  if (createTripMutation.isPending || !isLoaded)
    return (
      <HomeLayout>
        <View className="flex-row items-center justify-center flex-1">
          <Text className="text-xl text-sky-500">Loading...</Text>
        </View>
      </HomeLayout>
    );

  return (
    <HomeLayout>
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
          className="h-11 w-full text-base  p-2 bg-gray-100 rounded-xl text-gray-600"
        />
      </View>

      <CalendarBottomSheet
        inputIcon={
          <CalendarDays className="text-gray-500" height={20} width={20} />
        }
        inputPlaceholder="How many days will you be there?"
        bottomSheetTitle="Calendar"
        date={date}
        setDate={setDate}
      />
      <View style={{ gap: 4 }}>
        <GooglePlacesAutocomplete
          placeholder="Search your city"
          ref={ref}
          textInputProps={{
            placeholderTextColor: "#d1d5db",
            onFocus: () => {},
          }}
          onPress={(data, details) => {
            setCity({
              name: data?.description,
              latitude: details?.geometry?.location?.lat ?? 0,
              longitude: details?.geometry?.location?.lng ?? 0,
              // @ts-ignore
              photos: details?.photos,
            });
          }}
          renderLeftButton={() => (
            <View className="absolute z-10 left-1.5 top-3.5 ">
              <MapPin className="text-gray-500" height={20} width={20} />
            </View>
          )}
          styles={{
            container: {
              flex: 0,
            },
            textInput: {
              backgroundColor: "#f3f4f6",
              borderRadius: 12,
              paddingLeft: 35,
              color: "#4b5563",
              height: 44,
              fontSize: 16,
            },
            textInputContainer: {
              backgroundColor: "white",
              padding: 0,
            },
          }}
          query={{
            key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
            language: "en",
          }}
          fetchDetails
          enablePoweredByContainer={false}
          renderRow={(data) => (
            <Text className="text-gray-500">{data.description}</Text>
          )}
        />
      </View>
      <ScrollView
        contentContainerStyle={{ gap: 12 }}
        showsHorizontalScrollIndicator={false}
        style={{ gap: 12 }}
        horizontal
      >
        {city?.photos?.length &&
          city.photos.map((item) => (
            <PlacePhoto
              key={item.photo_reference}
              url={item.photo_reference}
              selected={photo === item.photo_reference}
              selectPhoto={setPhoto}
            />
          ))}
      </ScrollView>
      <View style={{ gap: 12 }} className="mt-auto pb-6">
        <Button
          disabled={
            !name ||
            date.startDate === undefined ||
            date.endDate === undefined ||
            createTripMutation.isPending ||
            !city ||
            !photo
          }
          title="Create"
          fullWidth
          onPress={onSubmit}
        />
      </View>
    </HomeLayout>
  );
};

export default NewTrip;
