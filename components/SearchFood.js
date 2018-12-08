import React from 'react';
import { Text, View, ScrollView, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { styles } from '../styles/styles';
import { foodSchema } from '../database/schemas';
import Realm from 'realm';

export default class SearchFood extends React.Component {

  static navigationOptions = {
    title: 'Food',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerStyle: {
      backgroundColor: '#00A6FB'
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      search: '',
      chosenFood: null
    }
  }

  selectFood = item => {
    console.log(item);
  }

  render() {
    const { navigation } = this.props;
    const realmFood = navigation.getParam('realmFood', null);
    const { search } = this.state;

    const searchField =
        <TextInput
          style={[styles.textInput, { padding: 10, backgroundColor: '#00A6FB' }]}
          onChangeText={search => 
            this.setState({
              search
            })
          }
          value={search}
          placeholder={'Search'}
        />;

    const filterArray =
        realmFood && search.trim().length >= 2
        ? search.trim().split(' ').map(value => `name CONTAINS[c] "${value}"`)
        : [];

    const presentFood = (item) => 
        <View style={{padding: 10}}>
          <Text style={{fontSize: 16, fontWeight: '400'}}>{item.name}</Text>
          <Text>P: {item.protein} g, C: {item.carbs} g, F: {item.fat} g, kcal: {item.calories}</Text>
        </View>

    const foodList = 
        filterArray.length >= 1
          ? <FlatList
              data={realmFood.objects('food').filtered(filterArray.join(' AND '))}
              renderItem={({ item }) => (
                <View style={{borderBottomColor: 'grey', borderBottomWidth: 1}}>
                  <TouchableOpacity onPress={() => this.selectFood(item)}>
                    {presentFood(item)}
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => item.id}
            />
          : null;

    return (
      <View>
        {searchField}
        {foodList}
      </View>
    );
  }
}