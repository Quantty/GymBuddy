import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import Profile from './components/Profile';
import Nutrition from './components/Nutrition';
import SearchFood from './components/SearchFood';
import Realm from 'realm';

const NutritionStack = createStackNavigator({
  Main: { screen: Nutrition },
  Search: { screen: SearchFood }
}, { 
  initialRouteName: 'Main'
});

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
  Profile: { screen: Profile },
  Nutrition: { screen: NutritionStack }
}, {
  initialRouteName: 'Profile'
});

const App = () => {
  Realm.copyBundledRealmFiles();
  return createAppContainer(TabNavigator);
}

const AppContainer = App();

export default AppContainer;