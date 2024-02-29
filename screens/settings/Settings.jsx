import { useEffect, useRef, useState } from 'react'

import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  BackHandler,
  ScrollView
} from 'react-native'

import {
  Avatar,
  Button,
  Divider,
  IconButton,
  Switch,
  Text,
  TextInput
} from 'react-native-paper'

import FeatherIcons from '@expo/vector-icons/Feather'

import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet'

import useToast from '../../hooks/useToast'
import useLocalStorage from '../../hooks/useLocalStorage'

import SafeAreaView from '../../components/SafeAreaView'

const Settings = ({ navigation }) => {

  const bottomSheetRef = useRef(null)

  const toast = useToast()
  const localStorage = useLocalStorage()

  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false)
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false)


  useEffect(() => {
    (async () => {
      const biometric = await localStorage.getItem("isBiometricEnabled")

      if (biometric) {
        setIsBiometricEnabled(!!parseInt(biometric))
      }

      const darkMode = await localStorage.getItem("isDarkModeEnabled")

      if (darkMode) {
        setIsDarkModeEnabled(!!parseInt(darkMode))
      }
    })()
  }, [])

  const onBiometricToggle = async (value) => {
    try {
      await localStorage.setItem("isBiometricEnabled", value ? "1" : "0")

      setIsBiometricEnabled(value)
    } catch (error) {
      console.log(error)
    }
  }

  const onDarkModeToggle = async (value) => {
    try {
      await localStorage.setItem("isDarkModeEnabled", value ? "1" : "0")

      setIsDarkModeEnabled(value)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)

    return () => backHandler.remove()
  }, [])

  const onExternalLinkPress = () => toast({ message: "This feature is not yet available. Please check back later. Thank you!" })


  return (
    <ImageBackground style={styles.background} source={require('../../assets/dash.png')}>
      <SafeAreaView>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
              <Image style={{ width: 42, height: 42 }} source={require('../../assets/logo.png')} />
              <Text variant="titleLarge">Settings</Text>
            </View>

            <View style={{ backgroundColor: "rgba(0,0,0,0)", flexDirection: "row", alignItems: "center", gap: 16, paddingHorizontal: 8, paddingVertical: 24, borderRadius: 16 }}>
              <Avatar.Text label="LL" size={52} labelStyle={{ fontSize: 18, fontWeight: 700 }} style={{ backgroundColor: "#646ecb" }} />
              <View style={{ gap: -4 }}>
                <Text variant="titleLarge" style={{ color: "#131304", fontWeight: 700 }}>LIMAYY LOUIE DUCUT</Text>
                <Text variant="titleSmall" style={{ color: "#131304", opacity: 0.64 }}>Administrator</Text>
              </View>
            </View>

            <View style={{ backgroundColor: "rgba(250,250,255,1)", elevation: 1, borderColor: "rgba(255,255,255,1)", borderWidth: 1, borderRadius: 16, overflow: "hidden" }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                  <FeatherIcons name="smile" color="#131304" size={22} />
                  <Text variant="titleMedium" style={{ opacity: 0.9 }} >Enable Biometric</Text>
                </View>

                <Switch value={isBiometricEnabled} onValueChange={onBiometricToggle} />
              </View>

              <Divider bold horizontalInset />

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                  <FeatherIcons name="lock" color="#131304" size={22} />
                  <Text variant="titleMedium" style={{ opacity: 0.9 }}>Change Password</Text>
                </View>

                <IconButton
                  icon={({ color, size }) => <FeatherIcons name="external-link" color={color} size={size} />}
                  size={22}
                  onPress={onExternalLinkPress}
                />
              </View>
            </View>

            <View style={{ backgroundColor: "rgba(250,250,255,1)", elevation: 1, borderColor: "rgba(255,255,255,1)", borderWidth: 1, borderRadius: 16 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                  <FeatherIcons name="moon" color="#131304" size={22} />
                  <Text variant="titleMedium" style={{ opacity: 0.9 }}>Dark Mode</Text>
                </View>

                <Switch value={isDarkModeEnabled} onValueChange={onDarkModeToggle} />
              </View>
            </View>

            <View style={{ backgroundColor: "rgba(250,250,255,1)", elevation: 1, borderColor: "rgba(255,255,255,1)", borderWidth: 1, borderRadius: 16, overflow: "hidden" }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                  <FeatherIcons name="help-circle" color="#131304" size={22} />
                  <Text variant="titleMedium" style={{ opacity: 0.9 }} >Help</Text>
                </View>

                <IconButton
                  icon={({ color, size }) => <FeatherIcons name="external-link" color={color} size={size} />}
                  size={22}
                  onPress={onExternalLinkPress}
                />
              </View>

              <Divider bold horizontalInset />

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                  <FeatherIcons name="flag" color="#131304" size={22} />
                  <Text variant="titleMedium" style={{ opacity: 0.9 }}>Privacy Policy</Text>
                </View>

                <IconButton
                  icon={({ color, size }) => <FeatherIcons name="external-link" color={color} size={size} />}
                  size={22}
                  onPress={onExternalLinkPress}
                />
              </View>

              <Divider bold horizontalInset />

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                  <FeatherIcons name="file-text" color="#131304" size={22} />
                  <Text variant="titleMedium" style={{ opacity: 0.9 }}>Terms and Conditions</Text>
                </View>

                <IconButton
                  icon={({ color, size }) => <FeatherIcons name="external-link" color={color} size={size} />}
                  size={22}
                  onPress={onExternalLinkPress}
                />
              </View>
            </View>

            <Button
              mode="contained"
              icon={({ color, size }) => <FeatherIcons name="log-out" color={color} size={size} />}
              textColor="#fffafa"
              buttonColor="#eb5160"
              style={{
                borderRadius: 8,
                marginVertical: 32,
                paddingVertical: 4
              }}
              labelStyle={{
                fontSize: 16,
                fontWeight: 700
              }}
              onPress={() => bottomSheetRef.current.expand()}
            >
              Sign Out
            </Button>

            <View style={{ justifyContent: "center", alignItems: "center", paddingBottom: 32 }}>
              <Image style={{ width: 42, height: 42 }} source={require("../../assets/logo.png")} />
              <Text variant="titleMedium" style={{ color: "#646ecb", fontWeight: 700, opacity: 0.88 }}>BIONIC DISTRO</Text>
              <Text variant="labelMedium" style={{ color: "#131304", opacity: 0.76 }}>version 1.0.1:22824</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <BottomSheet
        index={-1}
        ref={bottomSheetRef}
        snapPoints={["28"]}
        backdropComponent={(props) => <BottomSheetBackdrop {...props} pressBehavior="none" appearsOnIndex={0} disappearsOnIndex={-1} />}
        enablePanDownToClose
      >
        <BottomSheetScrollView style={{ backgroundColor: "#effcff", }}>
          <View style={{ alignItems: "center" }}>
            <FeatherIcons name="alert-triangle" color="#131304" size={52} style={{ marginTop: 24 }} />
            <Text variant="titleMedium">Are you sure you want to proceed?</Text>

            <View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
              <Button mode="contained" onPress={() => navigation.navigate("Login")}>Yes</Button>
              <Button onPress={() => bottomSheetRef.current.close()}>No</Button>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </ImageBackground >
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover'
  },
  container: {
    padding: 16,
    gap: 16,
    flex: 1,
    flexDirection: 'column',
  },
})

export default Settings