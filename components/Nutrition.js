import React from 'react';
import { Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { styles, triangles } from '../styles/styles';
import { profileSchema, foodSchema } from '../database/schemas';
import Realm from 'realm';
import calculate from '../utils/nutrients';
import RNFS from 'react-native-fs';

export default class Nutrition extends React.Component {

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      chosenDate: new Date(),
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      realm: null,
      caloriest: 0,
      proteint: 0,
      carbst: 0,
      fatt: 0,
      realmFood: null
    }
  }

  componentDidMount() {
    Realm.open({
      schema: [profileSchema]
    }).then(realm => {
      this.setState({ realm }, () => {
        realm.addListener('change', this.loadData);
        this.loadData();
      });
    });
    Realm.open({
      path: 
        Platform.OS === 'ios' 
        ? RNFS.MainBundlePath + '/food.realm'
        : RNFS.DocumentDirectoryPath + '/food.realm',
      schema: [foodSchema],
      readOnly: true
    }).then(realmFood => {
      this.setState({ realmFood });
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
    const { chosenDate, 
      calories, protein, carbs, fat,
      caloriest, proteint, carbst, fatt,
      realmFood } = this.state;

    const { navigate } = this.props.navigation;

    const line =
      <View style={styles.borderLeft}/>

    const date = 
      <TouchableOpacity onPress={this.resetDate} style={[{flex: 1}]}>
        <View style={{alignSelf: 'center'}}>
          <Text style={styles.text}>
            {
              chosenDate.toLocaleDateString() === new Date().toLocaleDateString()
                ? 'Today'
                : chosenDate.toLocaleDateString()
            }
          </Text>
        </View>
      </TouchableOpacity>

    const dateRow = 
      <View style={[styles.row, styles.dateRow, {paddingTop: 7, paddingBottom: 7}]}>
        <TouchableOpacity onPress={this.decrementDate} style={{flex: 1}}>
          <View style={[triangles.triangle, triangles.triangleLeft, {alignSelf: 'center'}]} />
        </TouchableOpacity>
        {line}
        {date}
        {line}
        <TouchableOpacity onPress={this.incrementDate} style={{flex: 1}}>
          <View style={[triangles.triangle, triangles.triangleRight, {alignSelf: 'center'}]} />
        </TouchableOpacity>
      </View>

    const progressBar = (color, backgroundColor, text, nr, total, unit) => {
      let calc = Math.round(nr / total * 100);
      let width = calc > total ? '100%' : calc + '%';
      return <View style={{flex: 1}}>
        <Text style={{color, alignSelf: 'center'}}>{text}</Text>
        <View 
          style={[
            styles.progressBar, 
            {flex: 1, marginLeft: 5, marginRight: 5, backgroundColor}
          ]}>
          <View style={[styles.filler, {width, backgroundColor: color}]} />
        </View>
        <Text style={{color, alignSelf: 'center'}}>{nr} / {total} {unit}</Text>
      </View>
    }

    const food = 
      <View>
        <View style={[styles.row, styles.dateRow, {padding: 10}]}>
          <Text style={{fontSize: 15}}>Foods</Text>
        </View>
        <TouchableOpacity onPress={() => navigate('Search')}>
          <Text 
            style={{fontSize: 15, alignSelf: 'center', color: '#658E9C', fontWeight: 'bold', padding: 10}}
          >
            Add food
          </Text>
        </TouchableOpacity>
      </View>

    return (
      <ScrollView>
        {dateRow}
        <View style={[styles.row, styles.marginsLeftRight, {paddingTop: 10}]}>
          {progressBar('#33658A', '#86BBD8', 'Protein', proteint, protein, 'g')}
          {progressBar('#F02D3A', '#F28D57', 'Carbohydrates', carbst, carbs, 'g')}
          {progressBar('#F9A03F', '#F8DDA4', 'Fat', fatt, fat, 'g')}
        </View>
        <View style={[styles.marginsLeftRight]}>
          {progressBar('#53A548', '#A1CC66', 'Calories', caloriest, calories, 'kcal')}
        </View> 
        {food}
      </ScrollView>     
    );
  }
}