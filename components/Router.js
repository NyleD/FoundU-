import { createStackNavigator, createAppContainer } from 'react-navigation';
import Main from './Main'
import Home from './Home'
import SignIn from './SignIn'
import AssetExample from './AssetExample'

const Router = createStackNavigator({
  Home: {screen: Home},
  Main: {screen: Main},
  SignIn: {screen: SignIn},
  AssetExample: {screen: AssetExample}
});

export default createAppContainer(Router);