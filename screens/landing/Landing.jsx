import { useRef } from "react"

import {
  View,
  StyleSheet,
  ImageBackground,
  Image
} from 'react-native'

import { Button, Text } from 'react-native-paper'

import FeatherIcons from "@expo/vector-icons/Feather"

import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet"

import SafeAreaView from '../../components/SafeAreaView'

const Landing = ({ navigation }) => {

  const bottomSheetRef = useRef(null);

  return (
    <ImageBackground style={styles.background} source={require('../../assets/start.png')}>
      <SafeAreaView>
        <View style={styles.container}>
          <Image style={styles.logo} source={require('../../assets/logo.png')} />

          <View>
            <Text variant="headlineLarge" style={{ fontWeight: 700, letterSpacing: 2 }}>Bionic Distro</Text>
            <Text variant="bodyMedium" style={{ marginBottom: 48 }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla quaerat delectus voluptas exercitationem! Sunt delectus voluptatum saepe.</Text>

            <Button mode="contained" style={styles.button} onPress={() => navigation.navigate("Login")}>
              <Text variant="labelLarge" style={styles.label}>Log in</Text>
            </Button>

            <Button mode="outlined" style={[styles.button, styles['button--outlined'], { marginBottom: 76 }]} onPress={() => bottomSheetRef.current.expand()}>
              <Text variant="labelLarge" style={[styles.label, { color: '#646ECB' }]}>Sync now</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>



      <BottomSheet
        index={-1}
        ref={bottomSheetRef}
        snapPoints={["36"]}
        backdropComponent={(props) => <BottomSheetBackdrop {...props} pressBehavior="none" appearsOnIndex={0} disappearsOnIndex={-1} />}
        enablePanDownToClose
      >
        <BottomSheetScrollView style={{ backgroundColor: "#effcff", }}>
          <View style={{ alignItems: "center" }}>
            <View style={{ width: 88, height: 88, justifyContent: "center", alignItems: "center", borderColor: "#646ecb", borderWidth: 4, borderRadius: 64, marginTop: 16, marginBottom: 16 }}>
              <View style={{ backgroundColor: "#646ecb", width: 72, height: 72, justifyContent: "center", alignItems: "center", borderRadius: 64 }}>
                <FeatherIcons name="refresh-cw" color="#fffafa" size={42} />
              </View>
            </View>

            <Text variant="titleLarge">Syncing!</Text>
            <Text variant="titleSmall" style={{ width: "76%" }}>Please wait whilst your masterlist and transaction are being synchronized...</Text>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover'
  },
  container: {
    padding: 16,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  logo: {
    width: 54,
    height: 54
  },
  button: {
    padding: 2,
    marginVertical: 6,
    borderRadius: 6,
  },
  'button--outlined': {
    borderColor: '#646ECB'
  },
  label: {
    color: '#ffffff',
    fontWeight: 700,
    letterSpacing: 2
  }
})

export default Landing