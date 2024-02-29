import {
  SafeAreaView,
  View,
  FlatList as List,
  StyleSheet,
  Text,
  StatusBar,
  Button,
} from 'react-native'

import {
  Swipeable,
  GestureHandlerRootView
} from 'react-native-gesture-handler'

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Hello.',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Hello World.',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91ab97f63',
    title: 'Hello Expo.',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd92ab97f63',
    title: 'Hello Expo.',
  },
  {
    id: '3ac68afc-c605-48d5-a4f8-fbd92ab97f63',
    title: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
]

const Item = ({ title }) => (
  <GestureHandlerRootView>
    <Swipeable
      renderRightActions={() => {
        return (
          <View style={styles.button}>
            <Button title='Delete' />
          </View>
        )
      }}
      rightThreshold={100}
    >
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </Swipeable>
  </GestureHandlerRootView>
)

const FlatList = () => {
  return (
    <SafeAreaView style={styles.container}>
      <List
        data={DATA}
        renderItem={({ item }) => <Item title={item.title} />}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#131304',
    padding: 20,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  button: {
    // backgroundColor: '#131304',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  title: {
    color: '#f0f0e1',
    fontSize: 16,
  },
})

export default FlatList