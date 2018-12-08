import React from 'react';
import { View, 
          Image, 
          TouchableOpacity, 
          Text, 
          TextInput, 
          Picker,
          Button,
          ScrollView } from 'react-native';
import images from '../images';
import { styles } from '../styles/styles'
import { profileSchema, writeProfile } from '../database/schemas';
import Realm from 'realm';
import calculate from '../utils/nutrients';

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
      maintenance: 0,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      realm: null
    }
  }

  async componentDidMount() {
    let realm = await Realm.open({
      schema: [profileSchema]
    });
    this.setState({ realm }, () => {
      this.loadData();
    });
  }

  loadData = () => {
    let realm = this.state.realm;
    if (realm) {
      let profile = realm.objectForPrimaryKey('profile', 0);
      if (profile) {
        this.setState({
          male: profile.male,
          female: profile.female,
          weight: profile.weight.toString(),
          height: profile.height.toString(),
          age: profile.age.toString(),
          effort: profile.effort,
          maintenance: profile.maintenance
        });
      }
    }
  }

  saveData = () => {
    let { realm, male, female, weight, height, age, effort, maintenance } = this.state;
    if (this.verify) {
      writeProfile(realm, male, female, weight, height, age, effort, maintenance);
    }
  }

  handleMale = () => {
    let { male, female } = this.state;
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
    let { male, female } = this.state;
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
    let { male, female, weight, height, age, effort, maintenance } = this.state;
    if (this.verify()) {
      let result = calculate(weight, height, age, male, female, effort, maintenance);
      this.setState(result);
    }
  }

  render() {
    const { calories, protein, carbs, fat } = this.state;

    const textInput = (key, placeholder) => 
      <TextInput
        key={key}
        style={[styles.textInput, styles.height, styles.margins]}
        onChangeText={value => this.setState({
          [key]: value
        })}
        value={this.state[key]}
        keyboardType={'numeric'}
        placeholder={placeholder}
      />;

    const button = (onPress, title) =>
      <View style={[styles.row, styles.margins]} key={'button'.concat(title)}>
        <View style={{flex: 1}}>
          <Button 
            onPress={onPress}
            title={title}
          />
        </View>
      </View>

    const touchableImage = (onPress, source, key) =>
      <TouchableOpacity
        key={'touchableImage'.concat(key)}
        onPress={onPress}
      >
        <Image 
          source={source}
        />
      </TouchableOpacity>
      
    return (
      <ScrollView>
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
              {
                [
                  touchableImage(this.handleMale, this.state.male ? images.male : images.maleGrey, '1'),
                  touchableImage(this.handleFemale, this.state.female ? images.female : images.femaleGrey, '0')             
                ]
              }            
            </View>
            {
              [
                textInput('weight', 'kg'),
                textInput('height', 'cm'),
                textInput('age', 'years')
              ]
            }
            <View style={styles.textInput}>
              <Picker
                selectedValue={this.state.maintenance}       
                onValueChange={(itemValue, itemIndex) => this.setState({maintenance: itemValue})}
              >
                <Picker.Item label='Lose weight' value={-10}/>
                <Picker.Item label='Maintain weight' value={0}/>
                <Picker.Item label='Gain weight' value={10}/>
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
        {
          [
            button(this.calculate, 'Calculate'),
            button(this.saveData, 'Save'),
            button(this.loadData, 'Load')
          ]
        }
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