import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Profile from './components/Profile';
import Nutrition from './components/Nutrition';

const TabNavigator = createBottomTabNavigator({
  Profile: Profile,
  Nutrition: Nutrition
}, {
  initialRouteName: 'Profile'
});

const AppContainer = createAppContainer(TabNavigator);

export default AppContainer;