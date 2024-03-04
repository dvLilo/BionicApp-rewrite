import { useEffect, useRef } from 'react'

import * as SQLite from 'expo-sqlite'

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

  const db = SQLite.openDatabase("bionic.db")

  const bottomSheetRef = useRef(null);

  // useEffect(() => {
  //   (async () => {

  //     db.transactionAsync(async (trxn) => {
  //       try {
  //         const res = await trxn.executeSqlAsync("DROP TABLE IF EXISTS `farms`")
  //         // const res = await trxn.executeSqlAsync("CREATE TABLE IF NOT EXISTS `farms` (`id` INTEGER PRIMARY KEY, `sync_id` INTEGER NOT NULL, `name` VARCHAR(255) UNIQUE NOT NULL, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
  //         // const res = await trxn.executeSqlAsync("INSERT INTO `farms` (`sync_id`, `name`) values (?, ?)", [1, "LARA 1"])
  //         // const res = await trxn.executeSqlAsync("SELECT * FROM `farms`")

  //         console.log(res)
  //       } catch (error) {
  //         console.log("Error: ", error)
  //       }


  //   })
  //     })()
  // }, [])

  const initializeDatabaseSetup = (index) => {
    if (index === 0) {
      db.execAsync([{ sql: "PRAGMA foreign_keys = ON", args: [] }], false)

      db.transactionAsync(async (trxn) => {
        try {
          // Reset tables
          // await trxn.executeSqlAsync("DROP TABLE IF EXISTS `users`")
          // await trxn.executeSqlAsync("DROP TABLE IF EXISTS `categories`")
          // await trxn.executeSqlAsync("DROP TABLE IF EXISTS `farms`")
          // await trxn.executeSqlAsync("DROP TABLE IF EXISTS `buildings`")
          // await trxn.executeSqlAsync("DROP TABLE IF EXISTS `plate`")

          // await trxn.executeSqlAsync("DROP TABLE IF EXISTS `informations`")
          // await trxn.executeSqlAsync("DROP TABLE IF EXISTS `transactions`")

          await trxn.executeSqlAsync("CREATE TABLE IF NOT EXISTS `users` (`id` INTEGER PRIMARY KEY, `sync_id` INTEGER NOT NULL, `fullname` VARCHAR(255) NOT NULL, `username` VARCHAR(255) NOT NULL, `password` VARCHAR(255) NOT NULL, `role` VARCHAR(255) NOT NULL, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")

          await trxn.executeSqlAsync("CREATE TABLE IF NOT EXISTS `categories` (`id` INTEGER PRIMARY KEY, `sync_id` INTEGER NOT NULL, `name` VARCHAR(255) UNIQUE NOT NULL, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")

          await trxn.executeSqlAsync("CREATE TABLE IF NOT EXISTS `farms` (`id` INTEGER PRIMARY KEY, `sync_id` INTEGER NOT NULL, `name` VARCHAR(255) UNIQUE NOT NULL, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
          await trxn.executeSqlAsync("CREATE TABLE IF NOT EXISTS `buildings` (`id` INTEGER PRIMARY KEY, `sync_id` INTEGER NOT NULL, `name` VARCHAR(255) UNIQUE NOT NULL, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")

          await trxn.executeSqlAsync("CREATE TABLE IF NOT EXISTS `plates` (`id` INTEGER PRIMARY KEY, `sync_id` INTEGER NOT NULL, `name` VARCHAR(255) UNIQUE NOT NULL, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")

          await trxn.executeSqlAsync("CREATE TABLE IF NOT EXISTS `informations` (`id` INTEGER PRIMARY KEY, `user_id` INTEGER NOT NULL, `category_id` INTEGER NOT NULL, `farm_id` INTEGER NOT NULL, `building_id` INTEGER NOT NULL, `leadman_id` INTEGER NOT NULL, `checker_id` INTEGER NOT NULL, `buyer_id` INTEGER NOT NULL, `plate_id` INTEGER NOT NULL, `series_no` INTEGER NOT NULL, `harvested_at` TIMESTAMP NOT NULL, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")

          await trxn.executeSqlAsync("CREATE TABLE IF NOT EXISTS `transactions` (`id` INTEGER PRIMARY KEY, `information_id` INTEGER NOT NULL, `batch_no` INTEGER NOT NULL, `heads` REAL NOT NULL, `weight` REAL NOT NULL, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (`information_id`) REFERENCES `informations` (`id`) ON UPDATE CASCADE ON DELETE CASCADE)")

          // sample data for infomation table
          // await trxn.executeSqlAsync("INSERT INTO `informations` (`id`, `user_id`, `category_id`, `farm_id`, `building_id`, `leadman_id`, `checker_id`, `buyer_id`, `plate_id`, `series_no`, `harvested_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [1, 1, 1, 1, 1, 1, 1, 1, 1, 3042401, "04-03-2024"])

          // sample data for transaction table
          // await trxn.executeSqlAsync("INSERT INTO `transactions` (`id`, `information_id`, `batch_no`, `heads`, `weight`) VALUES (?, ?, ?, ?, ?)", [1, 1, 1, 20, 36.8])

          // await trxn.executeSqlAsync("DELETE FROM `informations` WHERE `id` = 1")

          // const informations = await trxn.executeSqlAsync("SELECT * FROM `informations`")
          // console.log("informations: ", informations.rows)

          // const transactions = await trxn.executeSqlAsync("SELECT * FROM `transactions`")
          // console.log("transactions: ", transactions.rows)


        } catch (error) {
          console.log("Create database table error: ", error)
        }
      })
    }
  }

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
        onChange={initializeDatabaseSetup}
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