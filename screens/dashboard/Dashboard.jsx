import { useCallback, useEffect, useRef, useState } from "react"

import { useFocusEffect } from "@react-navigation/native"

import * as SQLite from "expo-sqlite"

import dayjs from "dayjs"

import { useSelector } from "react-redux"

import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  BackHandler,
  FlatList
} from "react-native"

import {
  Button,
  IconButton,
  Text
} from "react-native-paper"

import FeatherIcons from "@expo/vector-icons/Feather"

import { Swipeable } from "react-native-gesture-handler"

import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet"

import { LinearGradient } from "expo-linear-gradient"

import SafeAreaView from "../../components/SafeAreaView"

const Dashboard = ({ navigation }) => {

  const db = SQLite.openDatabase("bionic.db")

  const user = useSelector((state) => state.user)
  console.log(user)

  const bottomSheetRef = useRef(null)

  const [transactions, setTransactions] = useState([])

  useFocusEffect(
    useCallback(() => {
      db.transactionAsync(async (trxn) => {
        try {
          const {
            rows: CATEGORIES
          } = await trxn.executeSqlAsync("SELECT `id`, `name` FROM `categories`")

          const {
            rows: FARMS
          } = await trxn.executeSqlAsync("SELECT `id`, `name` FROM `farms`")

          const {
            rows: BUILDINGS
          } = await trxn.executeSqlAsync("SELECT `id`, `name` FROM `buildings`")

          const {
            rows: PLATES
          } = await trxn.executeSqlAsync("SELECT `id`, `name` FROM `plates`")

          // await trxn.executeSqlAsync("UPDATE `informations` SET `is_synced` = 0 WHERE `id` = 1")

          const { rows } = await trxn.executeSqlAsync("SELECT * FROM `informations` ORDER BY `id` DESC")
          const res = rows.map((item) => {

            const category = CATEGORIES.find((categoryItem) => categoryItem.id === item.category_id)
            const farm = FARMS.find((farmItem) => farmItem.id === item.farm_id)
            const building = BUILDINGS.find((buildingItem) => buildingItem.id === item.building_id)
            const plate = PLATES.find((plateItem) => plateItem.id === item.plate_id)

            return {
              ...item,
              category,
              farm,
              building,
              plate
            }
          })

          setTransactions(res)
          // console.log(res)
        } catch (error) {
          console.log(error)
        }
      })
    }, [navigation])
  )

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

          <FlatList
            data={transactions}
            renderItem={({ item }) => (
              <Swipeable>
                <View style={{ backgroundColor: "#ffffff", flexDirection: "row", justifyContent: "space-between", alignItems: "center", minHeight: 42, marginBottom: 8, paddingVertical: 8, paddingHorizontal: 16, borderColor: "#fffafa", borderWidth: 1, borderRadius: 6, elevation: 1 }}>
                  <View style={{ flexDirection: "column", gap: -4 }}>
                    <Text variant="titleMedium" style={{ color: "#646ecb", fontWeight: 700 }}>TRN. NO. {item.id}</Text>
                    <Text variant="labelMedium" style={{ opacity: 0.76 }}>{item.farm.name} - {item.building.name}</Text>
                    <Text variant="labelSmall" style={{ opacity: 0.64 }}>{dayjs(item.harvested_at).format("MMM. DD, YYYY")}</Text>
                  </View>

                  <IconButton
                    mode="contained"
                    icon={({ color, size }) => <FeatherIcons name={item.is_synced ? "check" : "refresh-ccw"} color={color} size={size} />}
                    size={16}
                    onPress={() => { }}
                  />
                </View>
              </Swipeable>
            )}
            ListEmptyComponent={
              <View style={{ flexDirection: "column", alignItems: "center", paddingVertical: 16 }}>
                <FeatherIcons name="info" size={36} color="#eb5160" />
                <Text variant="bodyLarge" style={{ fontWeight: 700, opacity: 0.88 }}>No records found!</Text>
              </View>
            }
            keyExtractor={(_, index) => index}
          />
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

const TransactionBottom = ({ navigation }) => {

  const db = SQLite.openDatabase("bionic.db")

  const bottomSheetRef = useRef(null)

  const [transactions, setTransactions] = useState([])

  return (
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