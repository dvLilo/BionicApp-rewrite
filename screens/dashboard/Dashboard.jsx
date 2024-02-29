import { useEffect, useRef } from "react"

import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  BackHandler
} from "react-native"

import {
  Button,
  Text
} from "react-native-paper"

import FeatherIcons from "@expo/vector-icons/Feather"

import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet"

import { LinearGradient } from "expo-linear-gradient"

import SafeAreaView from "../../components/SafeAreaView"

const Dashboard = () => {

  const bottomSheetRef = useRef(null)

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true)

    return () => backHandler.remove()
  }, [])

  return (
    <ImageBackground style={styles.background} source={require("../../assets/dash.png")}>
      <SafeAreaView>
        <View style={styles.container}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <Image style={{ width: 42, height: 42 }} source={require("../../assets/logo.png")} />
            <Text variant="titleLarge">Fresh morning, Limayy.</Text>
          </View>


          <ImageBackground style={{ height: 128, borderRadius: 16, overflow: "hidden" }} source={require('../../assets/banner.png')}>
            <LinearGradient colors={["transparent", "#646ECB"]} start={{ x: 0, y: 0.5 }} end={{ x: 0.9, y: 0.5 }} style={{ flex: 1, alignItems: "flex-end", padding: 16 }}>
              <Text variant="titleMedium" style={{ color: "#fffafa" }}>Last time you sync from the server</Text>
              <Text variant="titleSmall" style={{ color: "#fffafa", opacity: 0.8, marginBottom: 12 }}>7th of February, 2014 9:30 PM</Text>

              <Button mode="contained" textColor="#131304" buttonColor="#fffafa" onPress={() => bottomSheetRef.current.expand()}>Sync now!</Button>
            </LinearGradient>
          </ImageBackground>

          <Text variant="titleMedium">Recent transactions</Text>

          <View style={{ backgroundColor: "rgba(0, 0, 0, 0.76)", width: "88%", height: 32, borderRadius: 12 }} />
          <View style={{ backgroundColor: "rgba(0, 0, 0, 0.76)", width: "82%", height: 32, borderRadius: 12 }} />
          <View style={{ backgroundColor: "rgba(0, 0, 0, 0.76)", width: "90%", height: 32, borderRadius: 12 }} />
          <View style={{ backgroundColor: "rgba(0, 0, 0, 0.76)", width: "100%", height: 32, borderRadius: 12 }} />
          <View style={{ backgroundColor: "rgba(0, 0, 0, 0.76)", width: "88%", height: 32, borderRadius: 12 }} />
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
    </ImageBackground >
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover"
  },
  container: {
    padding: 16,
    gap: 16,
    flex: 1,
    flexDirection: "column",
  },
})

export default Dashboard