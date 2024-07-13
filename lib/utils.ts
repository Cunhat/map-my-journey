import { Platform, Dimensions } from 'react-native';
import * as Device from 'expo-device';
import dayjs from 'dayjs';


export const getDeviceHeaderHeight = () => {
    const test = Device.modelName

  if (Platform.OS === 'ios') return 44;
  else return 0; 
  
};

export const createDaysArray = (number: number) => {
  return [...Array(number).keys()].map(i => ({   label: (i + 1).toString(),
    id: (i + 1).toString() + '_day',
    value:  (i + 1).toString() }));
};

export const getDates = (startDate: string, endDate: string) => {
  let start = dayjs(startDate).utc(true);
  const end = dayjs(endDate).utc(true);

  const dates: { id: string; value: string; label: string }[] = [];


  while (start.isBefore(end) || start.isSame(end)) {
    dates.push({id: start.format("YYYY-MM-DD"), value: start.format("YYYY-MM-DD"), label: start.format("D MMM YYYY")});
    start =start.add(1, "day");
  }

  return dates;
}