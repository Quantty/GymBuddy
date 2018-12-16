import React from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { VictoryChart, VictoryArea, VictoryTheme } from 'victory-native';

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

  constructor(props) {
    super(props);
    this.state = {
      userSelection: 'calories',
      days: 30
    }
  }

  takeRight = (array, n = 1) => {
    const length = array == null ? 0 : array.length;
    if (!length) {
      return [];
    }
    n = length - n;
    return array.slice(n < 0 ? 0 : n, length);
  }

  render() {

    const { navigation } = this.props;
    const realm = navigation.getParam('realm', null);

    const { userSelection, days } = this.state;

    let chart = null;

    if (realm) {
      const diet = realm.objects('diet');
      const data = new Map();

      diet.forEach(d => {
        if (data.get(d.date)) {
          data.set(d.date, data.get(d.date) + Math.round(d[userSelection] * d.grams / 100));
        } else {
          data.set(d.date, Math.round(d[userSelection] * d.grams / 100));
        }
      });

      const array = Array.from(data, ([key, value]) => {
        return { date: new Date(key), [userSelection]: value };
      });
      array.sort((a, b) => {
        return a.date.getTime() - b.date.getTime();
      });

      const chartData = this.takeRight(array, days);

      chart = 
        <VictoryChart
          theme={VictoryTheme.material}
          scale={{ x: 'time' }}
        >
          <VictoryArea 
            style={{ data: { fill: '#c43a31' }}}
            data={chartData}
            x='date'
            y={userSelection}
          />
        </VictoryChart>
    } else {
      chart =
        <Text>Unable to contact database</Text>
    }

    const buttonStyle = (key, value) => {
      return {
        flex: 0.25,
        borderWidth: 1,
        backgroundColor: key === value ? '#33658A' : '#86BBD8'
      }
    }

    const textStyle = {
      alignSelf: 'center', 
      fontWeight: '800',
      fontSize: 16
    }

    const buttonRow =
        <View style={{flexDirection: 'row', padding: 10}}>
          <TouchableOpacity 
            onPress={() => this.setState({userSelection: 'calories'})}
            style={buttonStyle(userSelection, 'calories')}
          >
            <Text style={textStyle}>
              Calories
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => this.setState({userSelection: 'protein'})}
            style={buttonStyle(userSelection, 'protein')}
          >
            <Text style={textStyle}>
              Protein
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => this.setState({userSelection: 'carbs'})}
            style={buttonStyle(userSelection, 'carbs')}
          >
            <Text style={textStyle}>
              Carbs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => this.setState({userSelection: 'fat'})}
            style={buttonStyle(userSelection, 'fat')}
          >
            <Text style={textStyle}>
              Fat
            </Text>
          </TouchableOpacity>
        </View>

    const daysRow =
        <View style={{flexDirection: 'row', padding: 10}}>
          <TouchableOpacity 
            onPress={() => this.setState({days: 30})}
            style={buttonStyle(days, 30)}
          >
            <Text style={textStyle}>
              30d
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => this.setState({days: 60})}
            style={buttonStyle(days, 60)}
          >
            <Text style={textStyle}>
              60d
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => this.setState({days: 90})}
            style={buttonStyle(days, 90)}
          >
            <Text style={textStyle}>
              90d
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => this.setState({days: 180})}
            style={buttonStyle(days, 180)}
          >
            <Text style={textStyle}>
              180d
            </Text>
          </TouchableOpacity>
        </View>

    return (
      <ScrollView>
        {buttonRow}
        {daysRow}
        {chart}
      </ScrollView>
    );
  }
}