import { HomeLayout } from "@/components/home-layout";
import { Button } from "@/components/ui/button";
import { CustomTextInput } from "@/components/ui/text-input";
import { CalendarDays, MapPin, Plane } from "lucide-react-native";
import React from "react";
import { Text, View, Image, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const NewTrip = () => {
  const [photos, setPhotos] = React.useState<Array<string>>([]);
  const [name, setName] = React.useState("");
  const [days, setDays] = React.useState("");

  return (
    <HomeLayout>
      <Text className="text-xl text-sky-500">Create a new trip</Text>
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
      <View className="relative">
        <CalendarDays
          className="text-gray-500 absolute z-10 left-1.5 top-3.5 "
          height={20}
          width={20}
        />
        <TextInput
          placeholder={"How many days will you be there?"}
          placeholderTextColor={"#d1d5db"}
          value={days}
          style={{ paddingLeft: 35 }}
          keyboardType={"number-pad"}
          onChangeText={(text) => setDays(text)}
          className="h-11 w-full text-base p-2 bg-gray-100 rounded-xl text-gray-600"
        />
      </View>
      <View style={{ gap: 4 }}>
        <GooglePlacesAutocomplete
          placeholder="Search your city"
          textInputProps={{
            placeholderTextColor: "#d1d5db",
            onFocus: () => {},
          }}
          onPress={(data, details = null) => {
            console.log("details", details);
            setPhotos(details?.photos);
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
        {/* <ScrollView
          contentContainerStyle={{ gap: 12 }}
          showsHorizontalScrollIndicator={false}
          style={{ gap: 12 }}
          horizontal
          // className="flex-row flex-wrap justify-center h-full"
        >
          {photos.length > 0 &&
            photos.map((photo) => (
              <View key={photo.photo_reference}>
                <Image
                  source={{
                    uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`,
                  }}
                  height={240}
                  width={240}
                  style={{ borderRadius: 12 }}
                ></Image>
              </View>
            ))}
        </ScrollView> */}
      </View>
      <View style={{ gap: 12 }} className="mt-auto pb-6">
        <Button title="Create" fullWidth />
        <Button title="Cancel" fullWidth type="secondary" />
      </View>
    </HomeLayout>
  );
};

export default NewTrip;
