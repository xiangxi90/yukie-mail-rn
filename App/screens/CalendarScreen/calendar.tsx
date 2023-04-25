import * as React from 'react';
import {Calendar, Mode} from 'react-native-big-calendar';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {
  Button,
  Dialog,
  Portal,
  SegmentedButtons,
  Text,
  TextInput,
} from 'react-native-paper';
import {addCalendar} from '../../storage/reducer/calendarSlice';
import {StyleSheet, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {TimePickerModal} from 'react-native-paper-dates';

// const e = [
//   {
//     title: 'Meeting',
//     start: new Date('2023-04-21T08:00:00.000Z'),
//     end: new Date('2023-04-21T11:00:00.000Z'),
//   },
//   {
//     title: 'Coffee break',
//     start: new Date(1682006400),
//     end: new Date('2023-04-21T10:00:00.000'),
//   },
// ];
type Props = {
  navigation: StackNavigationProp<{[key: string]: undefined}>;
};
type DayTime = {
  minutes: number;
  hours: number;
};
export const CalendarScreen = ({navigation}: Props) => {
  const events = useAppSelector(state => state.calendar.calendars);
  const dispatch = useAppDispatch();
  const now = new Date(Date.now());
  const [dialogVisible, setDailogVisible] = React.useState(false);
  const [timePickerVisible, setTimePickerVisible] = React.useState(false);
  const [timePicker2Visible, setTimePicker2Visible] = React.useState(false);
  const [outlinedDenseText, setOutlinedDenseText] = React.useState('');
  const [date, setDate] = React.useState<Date>(now);
  const [mode, setMode] = React.useState<Mode>('3days');
  const [startDayTime, setStartDaytime] = React.useState<DayTime>({
    hours: now.getHours(),
    minutes: now.getMinutes(),
  });
  const [endDayTime, setEndDaytime] = React.useState<DayTime>({
    hours: now.getHours(),
    minutes: now.getMinutes(),
  });

  const showDialog = () => setDailogVisible(true);
  const hideDialog = () => setDailogVisible(false);

  const onTimePickerDismiss = React.useCallback(() => {
    setTimePickerVisible(false);
  }, [setTimePickerVisible]);
  const onTimePickerConfirm = React.useCallback(
    ({hours, minutes}: DayTime) => {
      setTimePickerVisible(false);
      setStartDaytime({hours, minutes});
      console.log({hours, minutes});
    },
    [setTimePickerVisible],
  );
  const onTimePicker2Dismiss = React.useCallback(() => {
    setTimePicker2Visible(false);
  }, [setTimePicker2Visible]);
  const onTimePicker2Confirm = React.useCallback(
    ({hours, minutes}: DayTime) => {
      setTimePicker2Visible(false);
      setEndDaytime({hours, minutes});
      console.log({hours, minutes});
    },
    [setTimePicker2Visible],
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const onChangeDate = React.useCallback(([start, end]: [Date, Date]) => {
    console.log(`${start} - ${end}`);
    setDate(end);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textComponent}>
        <Text variant="displayMedium" numberOfLines={1} ellipsizeMode="tail">
          {date.getMonth() + 1} 月
        </Text>
      </View>
      <SegmentedButtons
        value={mode}
        style={styles.button}
        onValueChange={m => setMode(m as Mode)}
        buttons={[
          {value: 'day', label: 'day'},
          {value: '3days', label: '3days'},
          {value: 'week', label: 'week'},
          {value: 'month', label: 'month'},
        ]}
      />
      <Calendar
        events={events}
        height={600}
        mode={mode}
        date={date}
        onPressEvent={event => {
          // console.log(event);
        }}
        onPressDateHeader={data => {
          // console.log(data);
        }}
        onChangeDate={onChangeDate}
        moreLabel="dd"
        locale="zh"
      />
      <Button mode="outlined" onPress={showDialog} style={styles.button}>
        添加日程
      </Button>
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>日程</Dialog.Title>
          <TextInput
            mode="flat"
            style={styles.inputContainerStyle}
            dense
            theme={{
              roundness: 25,
            }}
            placeholder="日程名"
            value={outlinedDenseText}
            onChangeText={text => setOutlinedDenseText(text)}
            left={<TextInput.Affix text="日程名：  " />}
          />
          <Dialog.Content>
            <Button
              style={styles.timeButton}
              onPress={() => setTimePickerVisible(true)}
              uppercase={false}
              mode={'elevated'}>
              开始时间: {startDayTime.hours}:{startDayTime.minutes}
            </Button>
            <Button
              style={styles.timeButton}
              onPress={() => setTimePicker2Visible(true)}
              uppercase={false}
              mode={'elevated'}>
              结束时间: {endDayTime.hours}:{endDayTime.minutes}
            </Button>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                hideDialog();
                dispatch(
                  addCalendar({
                    title: outlinedDenseText,
                    start: new Date(now.getTime()),
                    end: new Date(
                      now.getTime() +
                        3600 * endDayTime.hours +
                        60 * endDayTime.minutes,
                    ),
                  }),
                );
              }}>
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>
        <TimePickerModal
          visible={timePickerVisible}
          onDismiss={onTimePickerDismiss}
          onConfirm={onTimePickerConfirm}
          hours={startDayTime.hours}
          minutes={startDayTime.minutes}
          use24HourClock={true}
        />
        <TimePickerModal
          visible={timePicker2Visible}
          onDismiss={onTimePicker2Dismiss}
          onConfirm={onTimePicker2Confirm}
          hours={endDayTime.hours}
          minutes={endDayTime.minutes}
          use24HourClock={true}
        />
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    margin: 10,
    flex: 1,
  },
  button: {
    margin: 20,
    alignContent: 'center',
  },
  textComponent: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  timeButton: {
    margin: 10,
  },
  inputContainerStyle: {
    margin: 8,
    marginLeft: 20,
    marginRight: 20,
  },
});
CalendarScreen.title = 'calendar';
