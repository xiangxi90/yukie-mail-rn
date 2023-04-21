import {Calendar} from 'react-native-big-calendar';
import {useAppDispatch, useAppSelector} from '../../hooks';
import {Button} from 'react-native-paper';
import {addCalendar} from '../../storage/reducer/calendarSlice';
const e = [
  {
    title: 'Meeting',
    start: new Date('2023-04-21T08:00:00.000Z'),
    end: new Date('2023-04-21T11:00:00.000Z'),
  },
  {
    title: 'Coffee break',
    start: new Date(1682006400),
    end: new Date('2023-04-21T10:00:00.000'),
  },
];

export const CalendarScreen = () => {
  const events = useAppSelector(state => state.calendarSlice.calendars);
  const dispatch = useAppDispatch();
  return (
    <>
      <Calendar
        events={events}
        height={600}
        mode={'day'}
        date={new Date(Date.now())}
        onPressEvent={event => {
          console.log(event);
        }}
        locale="zh"
      />
      <Button
        icon="camera"
        mode="contained"
        onPress={() => dispatch(addCalendar(e[0]))}>
        Press add event
      </Button>
    </>
  );
};

CalendarScreen.title = 'calendar';
