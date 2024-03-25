import { forwardRef, useCallback, useEffect, useRef, useState } from "react"

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
  FlatList,
  TouchableHighlight,
  TouchableOpacity
} from "react-native"

import {
  Button,
  IconButton,
  Text,
  TouchableRipple
} from "react-native-paper"

import FeatherIcons from "@expo/vector-icons/Feather"

import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet"

import { LinearGradient } from "expo-linear-gradient"

import SafeAreaView from "../../components/SafeAreaView"

import { useSyncInformationMutation } from "../../features/information/information.api"

const Dashboard = ({ navigation }) => {

  const db = SQLite.openDatabase("bionic.db")

  const bottomSheetRef = useRef(null)
  const transactionsSheetRef = useRef(null)

  const [syncInformation] = useSyncInformationMutation()

  const [transactions, setTransactions] = useState([])
  const [transaction, setTransaction] = useState(null)

  const getTransactionsHandler = () => {
    db.transactionAsync(async (trxn) => {
      try {
        // await trxn.executeSqlAsync("UPDATE `informations` SET `is_synced` = 0 WHERE `id` = ?", [1])

        const {
          rows: CATEGORIES
        } = await trxn.executeSqlAsync("SELECT `id`, `name` FROM `categories` WHERE `deleted_at` IS NULL")

        const {
          rows: FARMS
        } = await trxn.executeSqlAsync("SELECT `id`, `name` FROM `farms` WHERE `deleted_at` IS NULL")

        const {
          rows: BUILDINGS
        } = await trxn.executeSqlAsync("SELECT `id`, `name` FROM `buildings` WHERE `deleted_at` IS NULL")

        const {
          rows: LEADMANS
        } = await trxn.executeSqlAsync("SELECT `id`, `name` FROM `leadmans` WHERE `deleted_at` IS NULL")

        const {
          rows: BUYERS
        } = await trxn.executeSqlAsync("SELECT `id`, `name` FROM `buyers` WHERE `deleted_at` IS NULL")

        const {
          rows: PLATES
        } = await trxn.executeSqlAsync("SELECT `id`, `name` FROM `plates` WHERE `deleted_at` IS NULL")


        const {
          rows: INFROMATION
        } = await trxn.executeSqlAsync("SELECT * FROM `informations` ORDER BY `id` DESC")

        const result = INFROMATION.map((item) => {

          const category = CATEGORIES.find((categoryItem) => categoryItem.id === item.category_id)
          const farm = FARMS.find((farmItem) => farmItem.id === item.farm_id)
          const building = BUILDINGS.find((buildingItem) => buildingItem.id === item.building_id)
          const leadman = LEADMANS.find((leadmanItem) => leadmanItem.id === item.leadman_id)
          const buyer = BUYERS.find((buyerItem) => buyerItem.id === item.buyer_id)
          const plate = PLATES.find((plateItem) => plateItem.id === item.plate_id)

          return {
            ...item,
            category,
            farm,
            building,
            leadman,
            buyer,
            plate
          }
        })

        setTransactions(result)
      } catch (error) {
        console.log(error)
      }
    })
  }

  const syncTransactionHandler = async (data) => {
    await db.transactionAsync(async (trxn) => {
      try {
        const payload = {
          user_id: data.user_id,
          category_id: data.category_id,
          farm_id: data.farm_id,
          building_id: data.building_id,

          leadman_id: data.leadman.id,
          leadman_name: data.leadman.name,
          buyer_id: data.buyer.id,
          buyer_name: data.buyer.name,
          plate_id: data.plate.id,
          plate_name: data.plate.name,

          type: data.type,
          series_no: data.series_no,
          harvested_at: data.harvested_at,
        }

        const {
          rows: transactions
        } = await trxn.executeSqlAsync("SELECT `batch_no`, `heads`, `weight` FROM `transactions` WHERE `information_id` = ?", [data.id])

        await syncInformation({ ...payload, transactions }).unwrap()

        await trxn.executeSqlAsync("UPDATE `informations` SET `is_synced` = 1 WHERE `id` = ?", [data.id])
      } catch (error) {
        console.log("Synching information to database error: ", error)
      }
    })

    getTransactionsHandler()
  }

  useFocusEffect(
    useCallback(getTransactionsHandler, [navigation])
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
              <View style={{ minHeight: 42, marginBottom: 4 }}>
                <TouchableRipple style={{ borderRadius: 6 }} onPress={() => { setTransaction(item); transactionsSheetRef.current.collapse() }} borderless>
                  <View style={{ backgroundColor: "#ffffff", flexDirection: "row", flexGrow: 1, justifyContent: "space-between", alignItems: "center", borderColor: "#f0f0f0", borderWidth: 1, borderRadius: 6, paddingVertical: 8, paddingHorizontal: 16 }}>
                    <View style={{ flexDirection: "column", gap: -4 }}>
                      <Text variant="titleMedium" style={{ color: "#646ecb", fontWeight: 700 }}>TRN. NO. {item.id}</Text>
                      <Text variant="labelMedium" style={{ opacity: 0.76 }}>{item.farm.name} - {item.building.name}</Text>
                      <Text variant="labelSmall" style={{ opacity: 0.64 }}>{dayjs(item.harvested_at).format("MMM. DD, YYYY")}</Text>
                    </View>

                    <IconButton
                      mode="contained"
                      icon={({ color, size }) => <FeatherIcons name={item.is_synced ? "check" : "refresh-ccw"} color={color} size={size} />}
                      size={16}
                      disabled={!!item.is_synced}
                      onPress={() => syncTransactionHandler(item)}
                    />
                  </View>
                </TouchableRipple>
              </View>
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

      <TransactionBottom ref={transactionsSheetRef} transaction={transaction} />


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

const TransactionBottom = forwardRef(({ navigation, transaction }, ref) => {

  const db = SQLite.openDatabase("bionic.db")

  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    (async () => {
      if (transaction) {
        db.transactionAsync(async (trxn) => {
          const {
            rows
          } = await trxn.executeSqlAsync("SELECT `id`, `batch_no`, `heads`, `weight` FROM `transactions` WHERE `information_id` = ?", [transaction.id])

          setTransactions(rows)
        })
      }
    })()
  }, [transaction])

  return (
    <BottomSheet
      index={-1}
      ref={ref}
      snapPoints={["48", "90"]}
      backdropComponent={(props) => <BottomSheetBackdrop {...props} pressBehavior="none" appearsOnIndex={0} disappearsOnIndex={-1} />}
      enablePanDownToClose
    >
      <BottomSheetScrollView>
        <ImageBackground imageStyle={{ resizeMode: "cover", left: -200 }} style={{ height: 312, overflow: "hidden" }} source={require('../../assets/bottom.jpg')}>
          <LinearGradient colors={["transparent", "transparent", "#ffffff"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1, justifyContent: "flex-end", marginBottom: -1, paddingHorizontal: 16 }}>
            <Text
              variant="labelLarge"
              style={{
                backgroundColor: "#646ecb",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 16,
                color: "#fffafa",
                textTransform: "capitalize",
                alignSelf: "flex-start",
              }}
            >
              <FeatherIcons name="box" size={16} /> {transaction?.type}
            </Text>

            <Text variant="headlineMedium" style={{ fontWeight: 700 }}>{transaction?.farm.name} - {transaction?.building.name}</Text>
            <Text variant="labelMedium" style={{ opacity: 0.64 }}>{transaction?.category.name} - {transaction?.plate.name}</Text>
          </LinearGradient>
        </ImageBackground>

        <View style={{ flexDirection: "row", justifyContent: "center", gap: 16, marginVertical: 32 }}>
          <View style={{ width: 108, justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
            <FeatherIcons name="calendar" size={28} style={{ opacity: 0.76 }} />
            <Text variant="labelLarge" style={{ fontWeight: 700 }}>{dayjs(transaction?.harvested_at).format("MMM. DD, YYYY").toUpperCase()}</Text>
          </View>

          <View style={{ width: 108, justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
            <FeatherIcons name="user" size={28} style={{ opacity: 0.76 }} />
            <Text variant="labelLarge" style={{ fontWeight: 700 }}>{transaction?.leadman.name}</Text>
          </View>

          <View style={{ width: 108, justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
            <FeatherIcons name="shopping-bag" size={28} style={{ opacity: 0.76 }} />
            <Text variant="labelLarge" style={{ fontWeight: 700 }}>{transaction?.buyer.name}</Text>
          </View>
        </View>

        <View style={{ paddingBottom: 32 }}>
          {
            transactions?.map((item, index) => (
              <View style={{ marginVertical: 6, paddingHorizontal: 8 }} key={index}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", borderLeftColor: "#646ecb", borderLeftWidth: 4, minHeight: 64, paddingHorizontal: 8, gap: 16 }}>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text variant="bodyMedium">Batch No.</Text>
                    <Text variant="displaySmall">{item.batch_no.toString().padStart(2, '0')}</Text>
                  </View>

                  <View style={{ alignSelf: "flex-end", alignItems: "flex-end" }}>
                    <Text variant="titleMedium">Total number of heads: {item.heads}</Text>

                    <Text variant="titleLarge" style={{ fontWeight: 700, opacity: 0.76 }}>
                      <FeatherIcons name="compass" size={22} /> Weight of {item.weight}kgs
                    </Text>
                  </View>
                </View>
              </View>
            ))
          }
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  )
})

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