import { createBottomTabNavigator, createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import Profile from './components/Profile';
import Nutrition from './components/Nutrition';
import SearchFood from './components/SearchFood';
import Fitness from './components/Fitness';
import Workout from './components/Workout';
import Historic from './components/Historic';
import Login from './components/Login';
import Realm from 'realm';
import Exercise from './components/Exercise';

const ProfileStack = createStackNavigator({
  Main: { screen: Profile },
  Historic: { screen: Historic }
}, {
  initialRouteName: 'Main'
});

const NutritionStack = createStackNavigator({
  Main: { screen: Nutrition },
  Search: { screen: SearchFood }
}, { 
  initialRouteName: 'Main'
});

const FitnessStack = createStackNavigator({
  Main: { screen: Fitness },
  Workout: { screen: Workout },
  Exercise: {screen: Exercise}
}, { 
  initialRouteName: 'Main'
});

FitnessStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  }
}

NutritionStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  }
}

const TabNavigator = createBottomTabNavigator({
  Profile: { screen: ProfileStack },
  Nutrition: { screen: NutritionStack },
  Fitness: { screen: FitnessStack }
}, {
  initialRouteName: 'Profile',
  tabBarOptions: {
    activeTintColor: '#e91e63',
    labelStyle: {
      fontSize: 22,
      alignSelf: 'center'
    },
    allowFontScaling: true,
    style: {
      height: 40
    },
    tabStyle: {
      borderRadius: 6,
      backgroundColor: '#dcdcdc',
      borderWidth: 1,
      margin : 3,
      justifyContent: 'center'
    }
  }
});

const SwitchNavigator = createSwitchNavigator({
  Login: { screen: Login },
  Application: { screen: TabNavigator }
}, {
  initialRouteName: 'Login'
});

const App = () => {
  Realm.copyBundledRealmFiles();
  return createAppContainer(SwitchNavigator);
}

const AppContainer = App();

export default AppContainer;