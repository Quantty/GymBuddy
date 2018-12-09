import React from 'react';
import { Text, View, Button, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { styles } from '../styles/styles';

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

  selectFood = chosenFood => {
    this.setState({ chosenFood });
  }

  render() {
    const { navigation } = this.props;
    const realmFood = navigation.getParam('realmFood', null);
    const { search, chosenFood } = this.state;

    const searchField =
        <TextInput
          style={[styles.textInput, { padding: 10, borderTopWidth: 2, borderBottomWidth: 2 }, styles.dateRow]}
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

    const presentFood = (item, padding = 10) => 
        <View style={{padding}}>
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

    const chosen =
        chosenFood
          ? <View>
            {presentFood(chosenFood)}
            <View style={[styles.row, {padding: 5}]}>
              <View style={{flex: 0.2}}>
                <TextInput 
                  style={[{borderBottomWidth: 1, flex: 1}]}
                  value={this.state.grams}
                  onChangeText={grams => this.setState({grams})}
                />
              </View>
              <View style={{flex: 0.8}}>
                <View style={styles.row}>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={{flex: 1}}
                  >
                    <Text>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{flex: 1}}
                    onPress={() => this.setState({chosenFood: null})}
                  >
                    <Text>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
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