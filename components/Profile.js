import React from 'react';
import { View, 
          Image, 
          StyleSheet, 
          TouchableOpacity, 
          Text, 
          TextInput, 
          Picker,
          Button } from 'react-native';
import images from '../images';

export default class Profile extends React.Component {

  constructor() {
    super();
    this.state = {
      male: false,
      female: false,
      weight: '',
      height: '',
      age: '',
      effort: 1.2,
      maintenance: 0
    }
  }

  handleMale = () => {
    let male = this.state.male,
        female = this.state.female;
    if (male) {
      male = false;
    } else {
      male = true;
      female = false;
    }
    this.setState({
      male,
      female
    });
  }

  handleFemale = () => {
    let male = this.state.male,
        female = this.state.female;
    if (female) {
      female = false;
    } else {
      female = true;
      male = false;
    }
    this.setState({
      male,
      female
    });
  }

  verify = () => {
    let { male, female, weight, height, age } = this.state;
    if (!male && !female) {
      return false;
    }
    if (!Number(weight) ||
          !Number(height) ||
          !Number(age)) {
            return false;
          }
    return true;
  }

  calculate = () => {
    let { male, female, weight, height, age, effort, maintenance } = this.state,
        rest = 0,
        protein = 0,
        carbs = 0,
        fat = 0;
    if (this.verify()) {
      weight = Number(weight);
      height = Number(height);
      age = Number(age);
      if (male) {
        rest = 5;
      }
      if (female) {
        rest = -161;
      }
      let bmr = 10 * weight + 6.25 * height - 5 * age + rest;
      let calories = Math.round(bmr * effort + maintenance);
      if (effort === 1.2) {
        protein = Math.round(0.8 * weight);
      } else {
        protein = Math.round(1.6 * weight);
      }
      fat = Math.round(((calories - protein * 4) * 0.3) / 9);
      carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
      this.props.navigation.navigate('UserResult', { 
        calories,
        protein,
        carbs,
        fat 
      });
    }
  }

  render() {
    return (
      <View style={[{flex: 1}, styles.columnCenter]}>
        <View style={[styles.container, styles.margins]}>
          <View style={styles.column}>
            <Text style={[styles.height, styles.alignText, styles.margins]}>Gender:</Text>
            <Text style={[styles.height, styles.alignText, styles.margins]}>Weight:</Text>
            <Text style={[styles.height, styles.alignText, styles.margins]}>Height:</Text>
            <Text style={[styles.height, styles.alignText, styles.margins]}>Age:</Text>
            <Text style={[styles.height, styles.alignText, styles.margins]}>Looking to:</Text>
          </View>
          <View style={[{flex: 1}, styles.column]}>
            <View style={[styles.rowIcons, styles.margins]}>
              <TouchableOpacity 
                onPress={this.handleMale}
              >
                <Image 
                  source={this.state.male ? images.male : images.maleGrey}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.handleFemale}
              >
                <Image 
                  source={this.state.female ? images.female : images.femaleGrey}
                />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.textInput, styles.height, styles.margins]}
              onChangeText={weight => this.setState({weight})}
              value={this.state.weight}
              keyboardType={'numeric'}
              placeholder={'kg'}
            />
            <TextInput
              style={[styles.textInput, styles.height, styles.margins]}
              onChangeText={height => this.setState({height})}
              value={this.state.height}
              keyboardType={'numeric'}
              placeholder={'cm'}
            />
            <TextInput
              style={[styles.textInput, styles.height, styles.margins]}
              onChangeText={age => this.setState({age})}
              value={this.state.age}
              keyboardType={'numeric'}
              placeholder={'years'}
            />
            <View style={styles.textInput}>
              <Picker
                selectedValue={this.state.maintenance}       
                onValueChange={(itemValue, itemIndex) => this.setState({maintenance: itemValue})}
              >
                <Picker.Item label='Lose weight' value={-500}/>
                <Picker.Item label='Maintain weight' value={0}/>
                <Picker.Item label='Gain weight' value={500}/>
            </Picker>
          </View>
          </View>
        </View>
        <View style={[styles.row, styles.margins, styles.textInput]}>
          <Picker
            selectedValue={this.state.effort}
            style={{ width: '100%' }}
            onValueChange={(itemValue, itemIndex) => this.setState({effort: itemValue})}
          >
            <Picker.Item label='Little to no exercise' value={1.2}/>
            <Picker.Item label='Light exercise (1–3 days per week)' value={1.375}/>
            <Picker.Item label='Moderate exercise (3–5 days per week)' value={1.55}/>
            <Picker.Item label='Heavy exercise (6–7 days per week)' value={1.725}/>
            <Picker.Item label='Very heavy exercise (twice per day)' value={1.9}/>
          </Picker>
        </View>
        <View style={[styles.row, styles.margins]}>
          <View style={{flex: 1}}>
            <Button 
              onPress={this.calculate}
              title='Calculate'
            />
          </View>
        </View>
        {/* <View style={[styles.row, styles.margins]}>
          <View style={{flex: 1}}>
            <Button 
              title='Save'
            />
          </View>
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  column: {
    flexDirection: 'column'
  }, 
  columnCenter: {
    flexDirection: 'column',
    justifyContent: 'center'
  },  
  rowIcons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  row: {
    flexDirection: 'row'
  },
  textInput: {
    borderColor: 'grey',
    borderBottomWidth: 2,
    borderRadius: 10
  },
  height: {
    height: 40,
    padding: 5
  },
  margins: {
    margin: 10
  },
  alignText: {
    textAlignVertical: 'bottom'
  }
});