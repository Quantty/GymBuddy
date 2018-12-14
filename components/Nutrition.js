import React from 'react';
import { Text, View, ScrollView, TouchableOpacity, Platform, FlatList, Image } from 'react-native';
import { styles, triangles } from '../styles/styles';
import { profileSchema, foodSchema, dietSchema } from '../database/schemas';
import Realm from 'realm';
import calculate from '../utils/nutrients';
import RNFS from 'react-native-fs';
import { presentFood } from './PresentFood';
import images from '../images';

export default class Nutrition extends React.Component {

  static navigationOptions = {
    title: 'Nutrition',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerStyle: {
      backgroundColor: '#dcdcdc'
    }
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

  async componentDidMount() {
    let realm = await Realm.open({
      schema: [profileSchema, dietSchema]
    });
    let realmFood = await Realm.open({
      path: 
        Platform.OS === 'ios' 
        ? RNFS.MainBundlePath + '/food.realm'
        : RNFS.DocumentDirectoryPath + '/food.realm',
      schema: [foodSchema],
      readOnly: true
    });
    const total = this.calculateTotal(realm);
    realm.objects('profile').addListener((collection, changes) => {
      const result = this.loadData(realm);
      if (result) {
        this.setState({
          ...result
        });
      }
    });
    realm.objects('diet').addListener((collection, changes) => {
      const calculateTotal = this.calculateTotal(realm);
      this.setState({
        ...calculateTotal
      });
    });
    const result = this.loadData(realm);
    if (result) {
      this.setState({ 
        realm, 
        realmFood,
        ...total,
        ...result
      });
    } else {
      this.setState({
        realm,
        realmFood,
        ...total
      })
    }
  }

  calculateTotal = (realm = this.state.realm, chosenDate = this.state.chosenDate) => {
    const food = realm.objects('diet').filtered('date = $0', chosenDate.toLocaleDateString());
    let caloriest = 0,
        proteint = 0,
        carbst = 0,
        fatt = 0
    food.forEach(item => {
      caloriest += Math.round(item.calories * item.grams / 100);
      proteint += Number((item.protein * item.grams / 100).toFixed(2));
      carbst += Number((item.carbs * item.grams / 100).toFixed(2));
      fatt += Number((item.fat * item.grams / 100).toFixed(2));
    });
    return {
      caloriest,
      proteint: Math.round(proteint),
      carbst: Math.round(carbst),
      fatt: Math.round(fatt)
    }
  }

  saveFood = (chosenFood, grams = 100) => {
    const { realm } = this.state;
    const numberGrams = parseInt(grams);
    const date = this.state.chosenDate.toLocaleDateString();
    if (numberGrams) {
      realm.write(() => {
        realm.create('diet', {
          date,
          id: chosenFood.id,
          name: chosenFood.name,
          protein: chosenFood.protein,
          carbs: chosenFood.carbs,
          fat: chosenFood.fat,
          calories: chosenFood.calories,
          grams: numberGrams
        });
      });
    }
  }

  loadData = (realm = this.state.realm) => {
    let profile = realm.objectForPrimaryKey('profile', 0);
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
      return result;
    }
    return null;
  }

  incrementDate = () => {
    let chosenDate = new Date(this.state.chosenDate);
    chosenDate.setDate(chosenDate.getDate() + 1);
    const total = this.calculateTotal(undefined, chosenDate);
    this.setState({
      chosenDate,
      ...total
    });
  }

  decrementDate = () => {
    let chosenDate = new Date(this.state.chosenDate);
    chosenDate.setDate(chosenDate.getDate() - 1);
    const total = this.calculateTotal(undefined, chosenDate);
    this.setState({
      chosenDate,
      ...total
    });
  }

  resetDate = () => {
    const chosenDate = new Date();
    const total = this.calculateTotal(undefined, chosenDate);
    this.setState({
      chosenDate,
      ...total
    });
  }

  removeFood = (item, realm) => {
    realm.write(() => {
      realm.delete(item);
    });
  }

  render() {
    const { chosenDate, 
      calories, protein, carbs, fat,
      caloriest, proteint, carbst, fatt,
      realmFood, realm } = this.state;

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
        <View style={[styles.row, styles.dateRow, {paddingTop: 7, paddingBottom: 7, borderTopWidth: 1, borderBottomWidth: 1}]}>
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
        let width = calc > 100 ? '100%' : calc + '%';
        return (
          <View style={{flex: 0.3}}>
            <Text style={{color, alignSelf: 'center'}}>{text}</Text>
            <View 
              style={[
                styles.progressBar, 
                {flex: 1, backgroundColor}
              ]}>
              <View style={[styles.filler, {width, backgroundColor: color}]} />
            </View>
            <Text style={{color, alignSelf: 'center'}}>{nr} / {total} {unit}</Text>
          </View>
        )
    }

    const food = 
        <View style={{borderBottomWidth: 1}}>
          <View style={[styles.row, styles.dateRow, {padding: 10, borderTopWidth: 1, borderBottomWidth: 1}]}>
            <Text style={{fontSize: 16, fontWeight: '400'}}>Foods</Text>
          </View>
          <TouchableOpacity onPress={() => navigate('Search', { realmFood, saveFood: this.saveFood })}>
            <Text 
              style={{fontSize: 15, alignSelf: 'center', color: '#658E9C', fontWeight: 'bold', padding: 10}}
            >
              Add food
            </Text>
          </TouchableOpacity>
        </View>

    const foodList = 
        realm 
          ? <FlatList
            data={realm.objects('diet').filtered('date = $0', this.state.chosenDate.toLocaleDateString())}
            renderItem={({ item }) => {
              const tempItem = {...item};
              tempItem.calories = Math.round(item.calories * item.grams / 100);
              tempItem.protein = Number((item.protein * item.grams / 100).toFixed(2));
              tempItem.carbs = Number((item.carbs * item.grams / 100).toFixed(2));
              tempItem.fat = Number((item.fat * item.grams / 100).toFixed(2));
              return (
                <View style={{borderBottomColor: 'grey', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  {presentFood(tempItem, 10, item.grams)}
                  <TouchableOpacity 
                    onPress={() => this.removeFood(item, realm)}
                  >
                    <Image 
                      source={images.delete} 
                      style={{flex: 1, width: 40, height: 40, resizeMode: 'contain', alignSelf: 'center'}} 
                    />
                  </TouchableOpacity>
                </View>
              )
            }}
            keyExtractor={(item, index) => item.id + index}
          />
          : null;

    return (
      <ScrollView>
        {dateRow}
        <View style={[styles.row, {padding: 10, justifyContent: 'space-between'}]}>
          {progressBar('#33658A', '#86BBD8', 'Protein', proteint, protein, 'g')}
          {progressBar('#F02D3A', '#F28D57', 'Carbohydrates', carbst, carbs, 'g')}
          {progressBar('#F9A03F', '#F8DDA4', 'Fat', fatt, fat, 'g')}
        </View>
        <View style={[styles.marginsLeftRight]}>
          {progressBar('#53A548', '#A1CC66', 'Calories', caloriest, calories, 'kcal')}
        </View> 
        {food}
        {foodList}
      </ScrollView>     
    );
  }
}