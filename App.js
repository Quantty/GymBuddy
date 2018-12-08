import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import Profile from './components/Profile';
import Nutrition from './components/Nutrition';
import SearchFood from './components/SearchFood';
import Fitness from './components/Fitness';
import Realm from 'realm';

const TabNavigator = createBottomTabNavigator({
  Profile: { screen: Profile },
  Nutrition: createStackNavigator({
              Main: { screen: Nutrition },
              Search: { screen: SearchFood }
            }, { 
              initialRouteName: 'Main'
            }),
  Fitness: { screen: Fitness }
}, {
  initialRouteName: 'Fitness'
});

const App = () => {
  Realm.copyBundledRealmFiles();
  return createAppContainer(TabNavigator);
}

const AppContainer = App();

export default AppContainer;