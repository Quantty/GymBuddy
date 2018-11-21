import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import Profile from './components/Profile';
import Nutrition from './components/Nutrition';
import ProfileResult from './components/ProfileResult';

const TabNavigator = createBottomTabNavigator({
  Profile: { 
    screen: createStackNavigator({
      UserProfile: {
        screen: Profile
      },
      UserResult: {
        screen: ProfileResult
      }
    }, {
      initialRouteName: 'UserProfile',
      headerMode: 'none'
    })
  },
  Nutrition: { 
    screen: Nutrition 
  }
}, {
  initialRouteName: 'Profile'
});

const AppContainer = createAppContainer(TabNavigator);

export default AppContainer;