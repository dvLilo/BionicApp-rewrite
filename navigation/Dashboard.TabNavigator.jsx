import {
  TouchableWithoutFeedback, View
} from 'react-native'

import FeatherIcons from '@expo/vector-icons/Feather'

import {
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs'

import Dashboard from '../screens/dashboard/Dashboard'
import Transaction from '../screens/transaction/Transaction'
import Settings from '../screens/settings/Settings'

const Tab = createBottomTabNavigator();

const DashboardTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: '#effcff', borderTopWidth: 0, elevation: 0 }, tabBarActiveTintColor: 'blue', tabBarInactiveTintColor: 'gray' }}>
      <Tab.Screen
        name="Home"
        component={Dashboard}
        options={{
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 700
          },
          tabBarIcon: ({ size, color }) => <FeatherIcons name="trello" size={size} color={color} />
        }}
      />

      <Tab.Screen
        name="New"
        component={Transaction}
        options={({ navigation }) => ({
          tabBarButton: ({ children, ...rest }) => {
            return (
              <TouchableWithoutFeedback {...rest} onPress={() => navigation.navigate('New')}>
                <View style={{ backgroundColor: "#effcff", borderColor: rest.accessibilityState.selected ? 'blue' : 'gray', borderWidth: 3, height: 64, width: 64, borderRadius: 100, marginTop: -32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', elevation: 2 }}>
                  {children}
                </View>
              </TouchableWithoutFeedback>
            )
          },
          tabBarIcon: ({ color }) => <FeatherIcons name="plus" size={32} color={color} />,
          tabBarIconStyle: { marginBottom: 6 },
          tabBarLabelStyle: { fontSize: 12, fontWeight: 700, marginBottom: -20 },
          tabBarStyle: { display: "none" },
          unmountOnBlur: true
        })}
      />

      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 700
          },
          tabBarIcon: ({ size, color }) => <FeatherIcons name="settings" size={size} color={color} />
        }}
      />
    </Tab.Navigator>
  )
}

export default DashboardTabNavigator