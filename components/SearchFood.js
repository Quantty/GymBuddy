import React from 'react';
import { Text, View, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { styles } from '../styles/styles';
import { presentFood } from './PresentFood';

export default class SearchFood extends React.Component {

  static navigationOptions = {
    title: 'Food',
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
      search: 'sausage beef',
      chosenFood: null,
      grams: '100'
    }
  }

  saveFoodBack = () => {
    const { navigation } = this.props;
    const saveFood = navigation.getParam('saveFood', null);
    if (saveFood) {
      saveFood(this.state.chosenFood, this.state.grams);
      navigation.goBack();
    }
  }

  render() {
    const { navigation } = this.props;
    const realmFood = navigation.getParam('realmFood', null); 
    const { search, chosenFood } = this.state;

    const searchField =
        <TextInput
          style={[styles.textInput, { padding: 10, borderTopWidth: 2, borderBottomWidth: 2 }, styles.dateRow]}
          onChangeText={search => this.setState({ search })}
          value={search}
          placeholder={'Search'}
        />;

    const filterArray =
        realmFood && search.trim().length >= 2
          ? search.trim().split(' ').map(value => `name CONTAINS[c] "${value}"`)
          : [];

    const foodList = 
        filterArray.length >= 1
          ? <FlatList
              data={realmFood.objects('food').filtered(filterArray.join(' AND '))}
              renderItem={({ item }) => (
                <View style={{borderBottomColor: 'grey', borderBottomWidth: 1}}>
                  <TouchableOpacity onPress={() => this.setState({ chosenFood: item })}>
                    {presentFood(item)}
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => item.id + index}
            />
          : null;

    const chosen =
        chosenFood
          ? <View style={{padding: 5}}>
            {presentFood(chosenFood)}
            <View style={[styles.row, {paddingBottom: 10, justifyContent: 'space-evenly'}]}>
              <TextInput 
                style={[{borderWidth: 1, flex: 0.8}]}
                value={this.state.grams}
                onChangeText={grams => this.setState({ grams })}
                keyboardType={'numeric'}
              />
              <Text style={{fontSize: 20, fontWeight: '400', alignSelf: 'center'}}>grams</Text>
            </View>
            <View style={[styles.row, {justifyContent: 'space-evenly'}]}>
              <TouchableOpacity
                onPress={() => this.saveFoodBack()}
                style={{backgroundColor: '#4392F1', borderWidth: 1, flex: 0.45, padding: 10}}
              >
                <Text style={{alignSelf: 'center'}}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({chosenFood: null})}
                style={{backgroundColor: '#DC493A', borderWidth: 1, flex: 0.45, padding: 10}}
              >
                <Text style={{alignSelf: 'center'}}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
          : <View style={{padding: 10}}>
            <Text style={{fontSize: 16, fontWeight: '400', alignSelf: 'center'}}>Please choose an item</Text>
          </View>

    return (
      <View>
        {chosen}
        {searchField}
        {foodList}
      </View>
    );
  }
}