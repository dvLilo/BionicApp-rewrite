import {
  createNativeStackNavigator
} from '@react-navigation/native-stack'

// screens
import Landing from '../screens/landing/Landing'
import Login from '../screens/login/Login'

// navigation
import DashboardTabNavigator from './Dashboard.TabNavigator'

const Stack = createNativeStackNavigator()

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}>
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="Login" component={Login} />

      <Stack.Screen name="Dashboard" component={DashboardTabNavigator} options={{ gestureEnabled: false }} />
    </Stack.Navigator>
  )
}

export default MainStackNavigator