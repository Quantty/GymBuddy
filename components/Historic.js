import React from 'react';
import { View, 
          Image, 
          TouchableOpacity, 
          Text, 
          TextInput, 
          Picker,
          Button,
          ScrollView } from 'react-native';
import { styles } from '../styles/styles'
import { profileSchema, writeProfile, dietSchema } from '../database/schemas';
import Realm from 'realm';

export default class Historic extends React.Component {

  static navigationOptions = {
    title: 'Historic',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerStyle: {
      backgroundColor: '#dcdcdc'
    }
  }

  constructor() {
    super();
    this.state = {
      
    }
  }

  render() {
    return (
      null
    );
  }
}