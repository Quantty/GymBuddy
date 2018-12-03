import React from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { styles, triangles } from '../styles/styles';
import { profileSchema } from '../database/schemas';
import Realm from 'realm';
import calculate from '../utils/nutrients';

export default class Nutrition extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      chosenDate: new Date(),
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      realm: null
    }
  }

  componentDidMount() {
    Realm.open({
      schema: [profileSchema]
    }).then(realm => {
      this.setState({ realm }, () => {
        this.loadData();
      });
    });
  }

  loadData = () => {
    let profile = this.state.realm.objectForPrimaryKey('profile', 0);
    if (profile) {
      let result = calculate(
        profile.weight,
        profile.height,
        profile.age,
        profile.male,
        profile.female,
        profile.effort,
        profile.maintenance
      )
      this.setState(result);
    }
  }

  incrementDate = () => {
    let chosenDate = new Date(this.state.chosenDate);
    chosenDate.setDate(chosenDate.getDate() + 1);
    this.setState({
      chosenDate
    });
  }

  decrementDate = () => {
    let chosenDate = new Date(this.state.chosenDate);
    chosenDate.setDate(chosenDate.getDate() - 1);
    this.setState({
      chosenDate
    });
  }

  resetDate = () => {
    this.setState({
      chosenDate: new Date()
    });
  }

  render() {
    console.log('rendered');
    let { chosenDate, calories, protein, carbs, fat } = this.state;
    let date = 
      <TouchableOpacity onPress={this.resetDate}>
        <View style={{justifyContent: 'center'}}>
          <Text style={styles.text}>
            {
              chosenDate.toLocaleDateString() === new Date().toLocaleDateString()
                ? 'Today'
                : chosenDate.toLocaleDateString()
            }
          </Text>
        </View>
      </TouchableOpacity>
    let dateRow = 
      <View style={[styles.rowIcons, styles.dateRow, {padding: 10}]}>
        <TouchableOpacity onPress={this.decrementDate}>
          <View style={[triangles.triangle, triangles.triangleLeft]} />
        </TouchableOpacity>
        {date}
        <TouchableOpacity onPress={this.incrementDate}>
          <View style={[triangles.triangle, triangles.triangleRight]} />
        </TouchableOpacity>
      </View>
    return (
      <ScrollView>
        {dateRow}
        <View>
          <Text style={styles.text}>{calories}kcal</Text>
          <Text style={styles.text}>{protein}g</Text>
          <Text style={styles.text}>{carbs}g</Text>
          <Text style={styles.text}>{fat}g</Text>
        </View> 
      </ScrollView>     
    );
  }
}