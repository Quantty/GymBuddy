import React from 'react';
import { Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { styles } from '../styles/styles';
import { foodSchema } from '../database/schemas';
import Realm from 'realm';

export default class SearchFood extends React.Component {

  static navigationOptions = {
    title: 'Search',
    headerTitleStyle: {
      fontWeight: 'bold',
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  render() {
    return (
      <View>

      </View>
    );
  }
}