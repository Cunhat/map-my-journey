import React, { useState, useMemo, useCallback } from "react";
import { StyleSheet, Text, View, TextStyle } from "react-native";
import { CalendarList, DateData } from "react-native-calendars";

const RANGE = 24;
const initialDate = "2024-07-07";
const nextWeekDate = "2024-07-14";
const nextMonthDate = "2024-08-05";

interface Props {
  horizontalView?: boolean;
}
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

export const CalendarListPicker: React.FC<Props> = ({
  horizontalView = false,
}) => {
  const [selected, setSelected] = useState(initialDate);
  const marked = useMemo(() => {
    return {
      [nextWeekDate]: {
        selected: selected === nextWeekDate,
        selectedTextColor: "#5E60CE",
        marked: true,
      },
      [nextMonthDate]: {
        selected: selected === nextMonthDate,
        selectedTextColor: "#5E60CE",
        marked: true,
      },
      [selected]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: "#5E60CE",
        selectedTextColor: "white",
      },
    };
  }, [selected]);

  const onDayPress = useCallback((day: DateData) => {
    setSelected(day.dateString);
  }, []);

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
      onVisibleMonthsChange={(months) => {
        console.log("now these months are visible", months);
      }}
      // Max amount of months allowed to scroll to the past. Default = 50
      pastScrollRange={50}
      // Max amount of months allowed to scroll to the future. Default = 50
      futureScrollRange={50}
      // Enable or disable scrolling of calendar list
      scrollEnabled={true}
      // Enable or disable vertical scroll indicator. Default = false
      showScrollIndicator={true}
      current={initialDate}
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

function renderCustomHeader(date: any) {
  const header = date.toString("MMMM yyyy");
  const [month, year] = header.split(" ");
  const textStyle: TextStyle = {
    fontSize: 18,
    fontWeight: "bold",
    paddingTop: 10,
    paddingBottom: 10,
    color: "#5E60CE",
    paddingRight: 5,
  };

  return (
    <View style={styles.header}>
      <Text style={[styles.month, textStyle]}>{`${month}`}</Text>
      <Text style={[styles.year, textStyle]}>{year}</Text>
    </View>
  );
}

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
