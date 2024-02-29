// import {
//   View,
//   Text,
//   Button,
//   TouchableWithoutFeedback,
//   StyleSheet,
// } from 'react-native'

// import FeatherIcons from '@expo/vector-icons/Feather'

// import {
//   NavigationContainer
// } from '@react-navigation/native'

// import {
//   createNativeStackNavigator
// } from '@react-navigation/native-stack'

// import {
//   createBottomTabNavigator
// } from '@react-navigation/bottom-tabs'

// const Stack = createNativeStackNavigator()

// const Tab = createBottomTabNavigator();

// const Home = ({ navigation }) => {
//   return (
//     <View style={styles.container}>
//       <Text>Home Screen</Text>
//       <Button
//         title="Move to Settings"
//         onPress={() => navigation.navigate("Settings")}
//       />
//     </View>
//   )
// }

// const Profile = ({ navigation }) => {
//   return (
//     <View style={styles.container}>
//       <Text>Profile Screen</Text>
//       <Button
//         title="Move to Settings"
//         onPress={() => navigation.navigate("Dashboard", { screen: "Settings" })}
//       />
//     </View>
//   )
// }

// const Settings = () => {
//   return (
//     <View style={styles.container}>
//       <Text>Settings Screen</Text>
//     </View>
//   )
// }

// const Create = () => {
//   return (
//     <View style={styles.container}>
//       <Text>Create Screen</Text>
//     </View>
//   )
// }


// const Tabs = () => {
//   return (
//     <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0, elevation: 0 } }}>
//       <Tab.Screen
//         name="Dashboard"
//         component={Stacks}
//         options={{
//           tabBarLabelStyle: {
//             fontSize: 12,
//             fontWeight: 700
//           },
//           tabBarIcon: ({ size, color }) => <FeatherIcons name="trello" size={size} color={color} />
//         }}
//       />

//       <Tab.Screen
//         name="New"
//         component={Create}
//         options={({ navigation }) => ({
//           tabBarButton: ({ children, ...rest }) => {
//             return (
//               <TouchableWithoutFeedback {...rest} onPress={() => navigation.navigate('New')}>
//                 <View style={{ backgroundColor: "#fff", borderColor: '#666', borderWidth: 3, height: 64, width: 64, borderRadius: 100, marginTop: -24, display: 'flex', alignItems: 'center', justifyContent: 'center', elevation: 2 }}>
//                   <FeatherIcons name="plus" size={32} color="#666" />
//                 </View>
//               </TouchableWithoutFeedback>
//             )
//           }
//         })}
//       />

//       <Tab.Screen
//         name="Settings"
//         component={Profile}
//         options={{
//           tabBarLabelStyle: {
//             fontSize: 12,
//             fontWeight: 700
//           },
//           tabBarIcon: ({ size, color }) => <FeatherIcons name="settings" size={size} color={color} />
//         }}
//       />
//     </Tab.Navigator>
//   )
// }

// const Stacks = () => {
//   return (
//     <Stack.Navigator screenOptions={{ animation: 'fade_from_bottom' }}>
//       <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
//       <Stack.Screen name="Settings" component={Settings} />
//     </Stack.Navigator>
//   )
// }

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Tabs />
//     </NavigationContainer>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#fff',
//     display: 'flex',
//     flex: 1,
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center'
//   }
// })


import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { Provider as PaperProvider } from 'react-native-paper'

import { ToastProvider } from './context/ToastProvider'

import {
  NavigationContainer
} from '@react-navigation/native'

import MainStackNavigator from './navigation/Main.StackNavigator'

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <ToastProvider>
          <NavigationContainer>
            <MainStackNavigator />
          </NavigationContainer>
        </ToastProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  )
}

export default App
