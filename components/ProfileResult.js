import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class ProfileResult extends React.Component {
  render() {
    const { navigation } = this.props;
    const calories = navigation.getParam('calories', 'undefined');
    const protein = navigation.getParam('protein', 'undefined');
    const carbs = navigation.getParam('carbs', 'undefined');
    const fat = navigation.getParam('fat', 'undefined');
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ flexDirection: 'column' }}>
          
        </View>
        <Text style={styles.text}>{calories}kcal</Text>
        <Text style={styles.text}>{protein}g</Text>
        <Text style={styles.text}>{carbs}g</Text>
        <Text style={styles.text}>{fat}g</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    fontSize: 20
  }
});