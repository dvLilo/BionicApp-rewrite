import {
  SafeAreaView as Container,

  StatusBar,
  StyleSheet
} from 'react-native'

const SafeAreaView = ({ children }) => {
  return (
    <Container style={styles.container}>
      {children}
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginTop: StatusBar.currentHeight || 0
  }
})

export default SafeAreaView