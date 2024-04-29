import { GooglePlaceData, GooglePlaceDetail } from "react-native-google-places-autocomplete";

export type Point = {
    latitude: number;
    longitude: number;
    description: string;
    category: string;
    day: string;
}

export type CurrentMarker = {
    details: GooglePlaceDetail;
    data: GooglePlaceData;
    latitude: number;
    longitude: number;
  }