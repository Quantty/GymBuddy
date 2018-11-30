import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import Weekdays from './WeekDays';

export default class Nutrition extends React.Component {
  render() {
    return (
      <ScrollView>
        <Weekdays />
        <Text>Nutrition</Text>
      </ScrollView>
    );
  }
}