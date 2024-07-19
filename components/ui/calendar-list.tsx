import React, { useState, useMemo, useCallback, useEffect } from "react";
import { StyleSheet, Text, View, TextStyle } from "react-native";
import { CalendarList, DateData } from "react-native-calendars";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export type CalendarDates = {
  startDate: string | undefined;
  endDate: string | undefined;
};

type CalendarProps = {
  date: CalendarDates;
  setDate: React.Dispatch<React.SetStateAction<CalendarDates>>;
};

export const CalendarListPicker: React.FC<CalendarProps> = ({
  date,
  setDate,
}) => {
  const marked = useMemo(() => {
    const intervalDates = () => {
      if (!date) return {};

      let startTs = dayjs(date.startDate).utc(true);
      const endTs = dayjs(date.endDate).utc(true);
      startTs = startTs.add(1, "day");

      let intervalObj = {};

      while (startTs.isBefore(endTs)) {
        intervalObj = {
          ...intervalObj,
          [startTs.format("YYYY-MM-DD")]: {
            color: "#0ea5e9",
            textColor: "white",
          },
        };
        startTs = startTs.add(1, "day");
      }

      return intervalObj;
    };

    let finalDate = {};

    if (date?.startDate === undefined && date?.endDate === undefined)
      return undefined;

    if (date.startDate) {
      finalDate = {
        ...finalDate,
        [date.startDate]: {
          selected: true,
          startingDay: date?.endDate ? true : false,
          // disableTouchEvent: true,
          selectedColor: "#0ea5e9",
          color: "#0ea5e9",
          textColor: "white",
        },
      };
    }

    if (date.endDate) {
      finalDate = {
        ...finalDate,
        [date.endDate]: {
          selected: true,
          endingDay: true,
          // disableTouchEvent: true,
          selectedColor: "#0ea5e9",
          color: "#0ea5e9",
          textColor: "white",
        },
      };
    }

    if (date.startDate && date.endDate) {
      finalDate = {
        ...finalDate,
        ...intervalDates(),
      };
    }

    return finalDate;
  }, [date]);

  const onDayPress = (day: DateData) => {
    if (date?.startDate && date?.endDate) {
      setDate({ startDate: day.dateString, endDate: undefined });
    } else if (!date?.startDate) {
      setDate({ startDate: day.dateString, endDate: undefined });
    } else if (dayjs(day.dateString).isBefore(dayjs(date?.startDate))) {
      setDate({ startDate: day.dateString, endDate: undefined });
    } else {
      setDate({ startDate: date.startDate, endDate: day.dateString });
    }
  };

  return (
    <CalendarList
      onDayPress={onDayPress}
      // Max amount of months allowed to scroll to the past. Default = 50
      pastScrollRange={50}
      // Max amount of months allowed to scroll to the future. Default = 50
      futureScrollRange={50}
      // Enable or disable scrolling of calendar list
      scrollEnabled={true}
      // Enable or disable vertical scroll indicator. Default = false
      showScrollIndicator={true}
      // current={selected}
      markedDates={marked}
      animateScroll={true}
      // current={date?.startDate}
      markingType={date?.startDate && date?.endDate ? "period" : "dot"}
    />
  );
};
