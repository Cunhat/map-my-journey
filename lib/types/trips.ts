type Trip = {
  id: string;
  name: string;
  days: number;
  city: string;
  latitude: number;
  longitude: number;
};

export type TripSchema = {
  city: string
  created_at: string
  days: number
  id: number
  latitude: number
  longitude: number
  name: string
  points: Array<any> | null
  userId: string
}