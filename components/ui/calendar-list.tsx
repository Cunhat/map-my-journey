import React, { useState, useMemo, useCallback, useEffect } from "react";
import { StyleSheet, Text, View, TextStyle } from "react-native";
import { CalendarList, DateData } from "react-native-calendars";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const RANGE = 24;
// const initialDate = "2024-07-07";

interface Props {}
const testIDs = {
  menu: {
    CONTAINER: "menu",
    CALENDARS: "calendars_btn",
    CALENDAR_LIST: "calendar_list_btn",
    HORIZONTAL_LIST: "horizontal_list_btn",
    AGENDA: "agenda_btn",
    EXPANDABLE_CALENDAR: "expandable_calendar_btn",
    WEEK_CALENDAR: "week_calendar_btn",
    TIMELINE_CALENDAR: "timeline_calendar_btn",
    PLAYGROUND: "playground_btn",
  },
  calendars: {
    CONTAINER: "calendars",
    FIRST: "first_calendar",
    LAST: "last_calendar",
  },
  calendarList: { CONTAINER: "calendarList" },
  horizontalList: { CONTAINER: "horizontalList" },
  agenda: {
    CONTAINER: "agenda",
    ITEM: "item",
  },
  expandableCalendar: { CONTAINER: "expandableCalendar" },
  weekCalendar: { CONTAINER: "weekCalendar" },
};

export const CalendarListPicker: React.FC<Props> = ({}) => {
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const marked = useMemo(() => {
    const intervalDates = () => {
      if (!startDate || !endDate) return {};

      let startTs = dayjs(startDate).utc(true);
      const endTs = dayjs(endDate).utc(true);
      startTs = startTs.add(1, "day");

      let intervalObj = {};

      while (startTs.isBefore(endTs)) {
        intervalObj = {
          ...intervalObj,
          [startTs.format("YYYY-MM-DD")]: { color: "green" },
        };
        startTs = startTs.add(1, "day");
      }

      return intervalObj;
    };

    let finalDate = {};

    if (startDate === undefined && endDate === undefined) return undefined;

    if (startDate) {
      finalDate = {
        ...finalDate,
        [startDate]: {
          selected: true,
          startingDay: true,
          disableTouchEvent: true,
          selectedColor: "black",
          color: "black",
        },
      };
    }

    if (endDate) {
      finalDate = {
        ...finalDate,
        [endDate]: {
          selected: true,
          endingDay: true,
          disableTouchEvent: true,
          selectedColor: "black",
          color: "black",
        },
      };
    }

    if (startDate && endDate) {
      finalDate = {
        ...finalDate,
        ...intervalDates(),
      };
    }

    return finalDate;
  }, [startDate, endDate]);

  const onDayPress = (day: DateData) => {
    if (startDate && endDate) {
      setStartDate(day.dateString);
      setEndDate(undefined);
    }

    if (!startDate) {
      setStartDate(day.dateString);
    } else {
      setEndDate(day.dateString);
    }
  };

  return (
    // <CalendarList
    //   testID={testIDs.calendarList.CONTAINER}
    //   current={initialDate}
    //   pastScrollRange={RANGE}
    //   futureScrollRange={RANGE}
    //   onDayPress={onDayPress}
    //   markedDates={marked}
    //   renderHeader={!horizontalView ? renderCustomHeader : undefined}
    //   calendarHeight={!horizontalView ? 390 : undefined}
    //   theme={!horizontalView ? theme : undefined}
    //   horizontal={horizontalView}
    //   pagingEnabled={horizontalView}
    //   staticHeader={horizontalView}
    // />
    <CalendarList
      // Callback which gets executed when visible months change in scroll view. Default = undefined
      //   onVisibleMonthsChange={(months) => {
      //     console.log("now these months are visible", months);
      //   }}
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
      current={startDate}
      markingType={startDate && endDate ? "period" : undefined}
      // theme={{
      //   // todayTextColor: "#0ea5e9",
      //   stylesheet: {
      //     day: {
      //       basic: {
      //         today: {
      //           borderColor: "#48BFE3",
      //           borderWidth: 0.8,
      //         },
      //         todayText: {
      //           color: "#5390D9",
      //           fontWeight: "800",
      //         },
      //       },
      //     },
      //   },
      // }}

      //
      // }}
      //   ...calendarParams
    />
  );
};

const theme = {
  stylesheet: {
    calendar: {
      header: {
        dayHeader: {
          fontWeight: "600",
          color: "#48BFE3",
        },
      },
    },
  },
  "stylesheet.day.basic": {
    today: {
      borderColor: "#48BFE3",
      borderWidth: 0.8,
    },
    todayText: {
      color: "#5390D9",
      fontWeight: "800",
    },
  },
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  month: {
    marginLeft: 5,
  },
  year: {
    marginRight: 5,
  },
});
