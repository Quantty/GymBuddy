import React from 'react';
import { View, Image, TouchableOpacity, Text, TextInput, Picker, Button, ScrollView } from 'react-native';
import images from '../images';
import { styles } from '../styles/styles'
import { profileSchema, writeProfile, dietSchema } from '../database/schemas';
import Realm from 'realm';
import calculate from '../utils/nutrients';
import SInfo from 'react-native-sensitive-info';
import config from '../config';

export default class Profile extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Profile',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerStyle: {
        backgroundColor: '#dcdcdc'
      },
      headerRight: (
        <Button
          onPress={() => navigation.navigate('Historic', { realm: navigation.getParam('realm', null) })}
          title='Historic >'
        />
      )
    }
  }

  constructor(props) {
    super(props);
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
    const token = await SInfo.getItem('accessToken', {});
    fetch('https://gymmybymmy.herokuapp.com/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify({data: {pula: 'fmm'}})
    })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
    const credentials = Realm.Sync.Credentials.jwt(token);
    let user = await Realm.Sync.User.login(config.REALM_CLOUD, credentials);
    let userConfig = user.createConfiguration({
      sync: {
        url: 'realms://bambuzlasdnai.de1a.cloud.realm.io/~/userRealm',
        fullSynchronization: true,
        error: err => console.log(err)
      },
      schema: [profileSchema, dietSchema]
    });
    let realm = await Realm.open(userConfig);
    const profile = this.loadData(realm);
    this.props.navigation.setParams({ realm });
    if (profile) {
      const result = this.calculateNutrition(profile.male, profile.female, profile.weight,
        profile.height, profile.age, profile.effort, profile.maintenance);
      const tempProfile = {...profile};
      tempProfile.weight = tempProfile.weight.toString();
      tempProfile.height = tempProfile.height.toString();
      tempProfile.age = tempProfile.age.toString();
      this.setState({ realm, ...tempProfile, ...result });
    } else {
      this.setState({ realm });
    }
  }

  handleLoading = (realm = this.state.realm) => {
    const profile = this.loadData(realm);
    if (profile) {
      const result = this.calculateNutrition(profile.male, profile.female, profile.weight,
        profile.height, profile.age, profile.effort, profile.maintenance);
      const tempProfile = {...profile};
      tempProfile.weight = tempProfile.weight.toString();
      tempProfile.height = tempProfile.height.toString();
      tempProfile.age = tempProfile.age.toString();
      this.setState({ ...tempProfile, ...result });
    }
  }

  loadData = (realm = this.state.realm) => {
    if (realm) {
      let profile = realm.objectForPrimaryKey('profile', 0);
      if (profile) {
        return profile;
      }
    }
    return null;
  }

  saveData = () => {
    let { realm, male, female, weight, height, age, effort, maintenance } = this.state;
    if (this.verify(male, female, weight, height, age)) {
      writeProfile(realm, male, female, weight, height, age, effort, maintenance);
    }
  }

  handleMale = () => {
    let { male, female, weight, height, age, effort, maintenance } = this.state;
    if (male) {
      male = false;
    } else {
      male = true;
      female = false;
    }
    const result = this.calculateNutrition(male, female, weight, height, age, effort, maintenance);
    this.setState({
      male,
      female,
      ...result
    });
  }

  handleFemale = () => {
    let { male, female, weight, height, age, effort, maintenance } = this.state;
    if (female) {
      female = false;
    } else {
      female = true;
      male = false;
    }
    const result = this.calculateNutrition(male, female, weight, height, age, effort, maintenance);
    this.setState({
      male,
      female,
      ...result
    });
  }

  verify = (male, female, weight, height, age) => {
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

  calculateNutrition = (male, female, weight, height, age, effort, maintenance) => {
    if (this.verify(male, female, weight, height, age)) {
      let result = calculate(weight, height, age, male, female, effort, maintenance);
      return result;
    }
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    }
  }

  handleChange = (key, value) => {
    const tempState = {...this.state};
    tempState[key] = value;
    const result = this.calculateNutrition(tempState.male, tempState.female, tempState.weight, 
      tempState.height, tempState.age, tempState.effort, tempState.maintenance);
    this.setState({
      [key]: value,
      ...result
    });
  }

  render() {
    const { calories, protein, carbs, fat } = this.state;

    const textInput = (key, placeholder) => 
        <TextInput
          key={key}
          style={[styles.textInput, styles.height, styles.margins]}
          onChangeText={value => this.handleChange(key, value)}
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

    const nutritionRow = (name, number, unit) =>
        <View style={{padding: 10, flexDirection: 'row', backgroundColor: '#dcdcdc', justifyContent: 'space-around'}}>
          <Text style={{fontSize: 16, fontWeight: '400'}}>{name}</Text>
          <Text style={{fontSize: 16, fontWeight: '400'}}>{number} {unit}</Text>
        </View>
      
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
              {touchableImage(this.handleMale, this.state.male ? images.male : images.maleGrey, '1')}
              {touchableImage(this.handleFemale, this.state.female ? images.female : images.femaleGrey, '0')}                      
            </View>
              {textInput('weight', 'kg')}
              {textInput('height', 'cm')}
              {textInput('age', 'years')}
            <View style={styles.textInput}>
              <Picker
                selectedValue={this.state.maintenance}       
                onValueChange={(itemValue, itemIndex) => this.handleChange('maintenance', itemValue)}
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
            onValueChange={(itemValue, itemIndex) => this.handleChange('effort', itemValue)}
          >
            <Picker.Item label='Little to no exercise' value={1.2}/>
            <Picker.Item label='Light exercise (1–3 days per week)' value={1.375}/>
            <Picker.Item label='Moderate exercise (3–5 days per week)' value={1.55}/>
            <Picker.Item label='Heavy exercise (6–7 days per week)' value={1.725}/>
            <Picker.Item label='Very heavy exercise (twice per day)' value={1.9}/>
          </Picker>
        </View>
        {nutritionRow('Calories', calories, 'kcal')}
        {nutritionRow('Protein', protein, 'g')}
        {nutritionRow('Carbs', carbs, 'g')}
        {nutritionRow('Fat', fat, 'g')}  
        {button(this.saveData, 'Save')}
        {button(() => this.handleLoading(), 'Load')}    
      </ScrollView>
    );
  }
}