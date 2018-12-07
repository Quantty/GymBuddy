import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import Profile from './components/Profile';
import Nutrition from './components/Nutrition';
import SearchFood from './components/SearchFood';
import Realm from 'realm';

const TabNavigator = createBottomTabNavigator({
  Profile: { screen: Profile },
  Nutrition: createStackNavigator({
              Main: { screen: Nutrition },
              Search: { screen: SearchFood }
            }, { 
              initialRouteName: 'Main'
            })
}, {
  initialRouteName: 'Profile'
});

const App = () => {
  Realm.copyBundledRealmFiles();
  return createAppContainer(TabNavigator);
}

const AppContainer = App();

export default AppContainer;