import { useRef } from "react"

import * as SQLite from "expo-sqlite"

import {
  View,
  StyleSheet,
  ImageBackground,
  Image
} from "react-native"

import { Button, Text } from "react-native-paper"

import FeatherIcons from "@expo/vector-icons/Feather"

import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet"

import SafeAreaView from "../../components/SafeAreaView"

import useDisclosure from "../../hooks/useDisclosure"

import { useLazyGetSyncCategoriesQuery } from "../../features/category/category.api"
import { useLazyGetSyncFarmsQuery } from "../../features/farm/farm.api"
import { useLazyGetSyncBuildingsQuery } from "../../features/building/building.api"
import { useLazyGetSyncBuyersQuery } from "../../features/buyer/buyer.api"
import { useLazyGetSyncLeadmenQuery } from "../../features/leadman/leadman.api"
import { useLazyGetSyncPlatesQuery } from "../../features/plate/plate.api"

const Landing = ({ navigation }) => {

  const db = SQLite.openDatabase("bionic.db")

  const { open: isSynching, onToggle: toggleSynching } = useDisclosure(true)

  const [getCategories] = useLazyGetSyncCategoriesQuery()
  const [getFarms] = useLazyGetSyncFarmsQuery()
  const [getBuildings] = useLazyGetSyncBuildingsQuery()
  const [getBuyers] = useLazyGetSyncBuyersQuery()
  const [getLeadmen] = useLazyGetSyncLeadmenQuery()
  const [getPlates] = useLazyGetSyncPlatesQuery()

  const bottomSheetRef = useRef(null);

  const initializeDatabaseSetup = (index) => {
    if (index === 0) {
      db.execAsync([{ sql: "PRAGMA foreign_keys = ON", args: [] }], false)

      db.transactionAsync(async (trxn) => {
        try {
          // Reset tables
          // await trxn.executeSqlAsync("DROP TABLE IF EXISTS `users`")
          // await trxn.executeSqlAsync("DROP TABLE IF EXISTS `categories`")
          // await trxn.executeSqlAsync("DROP TABLE IF EXISTS `buildings`")
          // await trxn.executeSqlAsync("DROP TABLE IF EXISTS `farms`")
          // await trxn.executeSqlAsync("DROP TABLE IF EXISTS `buyers`")
          // await trxn.executeSqlAsync("DROP TABLE IF EXISTS `leadmans`")
          // await trxn.executeSqlAsync("DROP TABLE IF EXISTS `plates`")

          // await trxn.executeSqlAsync("DROP TABLE IF EXISTS `informations`")
          // await trxn.executeSqlAsync("DROP TABLE IF EXISTS `transactions`")


          await trxn.executeSqlAsync("CREATE TABLE IF NOT EXISTS `users` (`id` INTEGER PRIMARY KEY, `sync_id` INTEGER NOT NULL, `fullname` VARCHAR(255) NOT NULL, `username` VARCHAR(255) NOT NULL, `password` VARCHAR(255) NOT NULL, `role` VARCHAR(255) NOT NULL, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `deleted_at` TIMESTAMP DEFAULT NULL)")


          await trxn.executeSqlAsync("CREATE TABLE IF NOT EXISTS `categories` (`id` INTEGER PRIMARY KEY, `sync_id` INTEGER UNIQUE NOT NULL, `name` TEXT NOT NULL, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `deleted_at` TIMESTAMP DEFAULT NULL)")


          await trxn.executeSqlAsync("CREATE TABLE IF NOT EXISTS `buildings` (`id` INTEGER PRIMARY KEY, `sync_id` INTEGER UNIQUE NOT NULL, `name` TEXT NOT NULL, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `deleted_at` TIMESTAMP DEFAULT NULL)")

          await trxn.executeSqlAsync("CREATE TABLE IF NOT EXISTS `farms` (`id` INTEGER PRIMARY KEY, `sync_id` INTEGER UNIQUE NOT NULL, `name` TEXT NOT NULL, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `deleted_at` TIMESTAMP DEFAULT NULL)")

          await trxn.executeSqlAsync("DROP TABLE IF EXISTS `farm_buildings`")
          await trxn.executeSqlAsync("CREATE TABLE IF NOT EXISTS `farm_buildings` (`id` INTEGER PRIMARY KEY, `sync_id` INTEGER UNIQUE NOT NULL, `farm_id` INTEGER NOT NULL, `building_id` INTEGER NOT NULL, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")


          await trxn.executeSqlAsync("CREATE TABLE IF NOT EXISTS `buyers` (`id` INTEGER PRIMARY KEY, `sync_id` INTEGER UNIQUE NOT NULL, `name` TEXT NOT NULL, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `deleted_at` TIMESTAMP DEFAULT NULL)")

          await trxn.executeSqlAsync("CREATE TABLE IF NOT EXISTS `leadmans` (`id` INTEGER PRIMARY KEY, `sync_id` INTEGER UNIQUE NOT NULL, `name` TEXT NOT NULL, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `deleted_at` TIMESTAMP DEFAULT NULL)")

          await trxn.executeSqlAsync("CREATE TABLE IF NOT EXISTS `plates` (`id` INTEGER PRIMARY KEY, `sync_id` INTEGER UNIQUE NOT NULL, `name` TEXT NOT NULL, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `deleted_at` TIMESTAMP DEFAULT NULL)")



          await trxn.executeSqlAsync("CREATE TABLE IF NOT EXISTS `informations` (`id` INTEGER PRIMARY KEY, `is_synced` INTEGER NOT NULL DEFAULT 0, `user_id` INTEGER NOT NULL, `category_id` INTEGER NOT NULL, `farm_id` INTEGER NOT NULL, `building_id` INTEGER NOT NULL, `leadman_id` INTEGER NOT NULL, `buyer_id` INTEGER NOT NULL, `plate_id` INTEGER NOT NULL, `type` VARCHAR(255) NOT NULL, `series_no` INTEGER NOT NULL, `harvested_at` TIMESTAMP NOT NULL, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")


          await trxn.executeSqlAsync("CREATE TABLE IF NOT EXISTS `transactions` (`id` INTEGER PRIMARY KEY, `information_id` INTEGER NOT NULL, `batch_no` INTEGER NOT NULL, `heads` REAL NOT NULL, `weight` REAL NOT NULL, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (`information_id`) REFERENCES `informations` (`id`) ON UPDATE CASCADE ON DELETE CASCADE)")


          // sample data
          // await trxn.executeSqlAsync("INSERT INTO `users` (`sync_id`, `fullname`, `username`, `password`, `role`) values (?, ?, ?, ?, ?)", [1, "Limayy Louie Ducut", "llducut", "$2y$10$qQRHkqYiS2rrsVjU4sDTiOSkhSDzAvCPjWmV6D.fUkbXfyhMQPKAq", "Administrator"])

          const categories = await getCategories().unwrap()
          for (const item of categories) {
            await trxn.executeSqlAsync("INSERT OR REPLACE INTO `categories` (`sync_id`, `name`, `deleted_at`) VALUES (?, ?, ?)", [item.id, item.name, item.deleted_at])
          }

          const buildings = await getBuildings().unwrap()
          for (const item of buildings) {
            await trxn.executeSqlAsync("INSERT OR REPLACE INTO `buildings` (`sync_id`, `name`, `deleted_at`) VALUES (?, ?, ?)", [item.id, item.name, item.deleted_at])
          }

          const farms = await getFarms().unwrap()
          for (const item of farms) {
            await trxn.executeSqlAsync("INSERT OR REPLACE INTO `farms` (`sync_id`, `name`, `deleted_at`) VALUES (?, ?, ?)", [item.id, item.name, item.deleted_at])

            for (const buildingItem of item.buildings) {
              await trxn.executeSqlAsync("INSERT INTO `farm_buildings` (`sync_id`, `farm_id`, `building_id`) VALUES (?, ?, ?)", [buildingItem.pivot.id, buildingItem.pivot.farm_id, buildingItem.pivot.building_id])
            }
          }

          const buyers = await getBuyers().unwrap()
          for (const item of buyers) {
            await trxn.executeSqlAsync("INSERT OR REPLACE INTO `buyers` (`sync_id`, `name`, `deleted_at`) VALUES (?, ?, ?)", [item.id, item.name, item.deleted_at])
          }

          const leadmen = await getLeadmen().unwrap()
          for (const item of leadmen) {
            await trxn.executeSqlAsync("INSERT OR REPLACE INTO `leadmans` (`sync_id`, `name`, `deleted_at`) VALUES (?, ?, ?)", [item.id, item.name, item.deleted_at])
          }

          const plates = await getPlates().unwrap()
          for (const item of plates) {
            await trxn.executeSqlAsync("INSERT OR REPLACE INTO `plates` (`sync_id`, `name`, `deleted_at`) VALUES (?, ?, ?)", [item.id, item.name, item.deleted_at])
          }

          toggleSynching()
        } catch (error) {
          console.log("Create/sync database error: ", error)
        }
      })
    }

    if (index === -1) {
      toggleSynching()
    }
  }

  return (
    <ImageBackground style={styles.background} source={require('../../assets/start.png')}>
      <SafeAreaView>
        <View style={styles.container}>
          <Image style={styles.logo} source={require('../../assets/logo.png')} />

          <View>
            <Text variant="headlineLarge" style={{ fontWeight: 700, letterSpacing: 2 }}>Bionic Distro</Text>
            <Text variant="bodyMedium" style={{ marginBottom: 48 }}>Bionic Distro redefines farm management for poultry and swine with its intuitive tally sheet app. Whether offline or online, this versatile tool enables farmers to effortlessly record and sync vital data, fostering real-time insights and efficient operations.</Text>

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
          {isSynching &&
            <View style={{ alignItems: "center" }}>
              <View style={{ width: 88, height: 88, justifyContent: "center", alignItems: "center", borderColor: "#646ecb", borderWidth: 4, borderRadius: 64, marginTop: 16, marginBottom: 16 }}>
                <View style={{ backgroundColor: "#646ecb", width: 72, height: 72, justifyContent: "center", alignItems: "center", borderRadius: 64 }}>
                  <FeatherIcons name="refresh-cw" color="#fffafa" size={42} />
                </View>
              </View>

              <Text variant="titleLarge">Syncing!</Text>
              <Text variant="titleSmall" style={{ width: "76%" }}>Please wait whilst your masterlist and transaction are being synchronized...</Text>
            </View>}

          {!isSynching &&
            <View style={{ alignItems: "center" }}>
              <View style={{ width: 88, height: 88, justifyContent: "center", alignItems: "center", borderColor: "#00c851", borderWidth: 4, borderRadius: 64, marginTop: 16, marginBottom: 16 }}>
                <View style={{ backgroundColor: "#00c851", width: 72, height: 72, justifyContent: "center", alignItems: "center", borderRadius: 64 }}>
                  <FeatherIcons name="check" color="#fffafa" size={42} />
                </View>
              </View>

              <Text variant="titleLarge">Success!</Text>
              <Text variant="titleSmall" style={{ width: "78%" }}>Masterlist and transactions has been synchronized successfully!</Text>
            </View>}
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