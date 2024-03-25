import React, { useCallback, useEffect, useRef, useState } from "react"

import * as SQLite from "expo-sqlite"

import * as yup from "yup"

import dayjs from "dayjs"

import {
  View,
  StyleSheet,
  ImageBackground,
  FlatList,
  Image,
  TouchableOpacity
} from "react-native"

import {
  Button,
  Divider,
  HelperText,
  Text,
  TextInput,
  TouchableRipple
} from "react-native-paper"

import { useFocusEffect } from "@react-navigation/native"

import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet"

import { LinearGradient } from "expo-linear-gradient"

import DropDownPicker from "react-native-dropdown-picker"

import { DateTimePickerAndroid } from "@react-native-community/datetimepicker"

import { Swipeable } from "react-native-gesture-handler"

import FeatherIcons from "@expo/vector-icons/Feather"

import SafeAreaView from "../../components/SafeAreaView"

import { setInformationData, resetInformationData } from "../../features/information/information.slice"
import { useDispatch, useSelector } from "react-redux"

import useDisclosure from "../../hooks/useDisclosure"
import useLocalStorage from "../../hooks/useLocalStorage"

import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

const informationSchema = yup.object().shape({
  type: yup.string().required().label("Transaction type"),

  date_harvest: yup.date().required().label("Harvest date"),

  category: yup.object().required().label("Category"),
  farm: yup.object().required().label("Farm"),
  building: yup.object().required().label("Building no."),
  leadman: yup.object().required().label("Leadman"),
  buyer: yup.object().required().label("Buyer"),
  plate: yup.object().required().label("Plate no.")
})

const transactionSchema = yup.object().shape({
  information_id: yup.number().required().label("Information ID"),

  heads: yup.number().required().label("Heads").typeError("Invalid heads value."),
  weight: yup.number().required().label("Weight").typeError("Invalid weight value.")
})

const Transaction = ({ navigation }) => {

  const db = SQLite.openDatabase("bionic.db")

  const dispatch = useDispatch()

  const information = useSelector((state) => state.information)

  const bottomSheetRef = useRef(null);

  const {
    control,
    handleSubmit,
    setValue,
    resetField,

    formState: { errors }
  } = useForm({
    resolver: yupResolver(transactionSchema),
    defaultValues: {
      information_id: null,

      heads: "",
      weight: "",
    }
  })

  useEffect(() => {
    if (information) setValue("information_id", information.id)
  }, [information])

  const [index, setIndex] = useState(null)
  const [transactions, setTransactions] = useState([])

  const onSubmit = (data) => {

    const {
      information_id,
      heads,
      weight
    } = data

    const batch_no = transactions.length + 1

    db.transactionAsync(async (trxn) => {
      if (index === null) {
        await trxn.executeSqlAsync("INSERT INTO `transactions` (`information_id`, `batch_no`, `heads`, `weight`) VALUES (?, ?, ?, ?)", [information_id, batch_no, heads, weight])
      }
      else {
        await trxn.executeSqlAsync("UPDATE `transactions` SET `heads` = ?, `weight` = ? WHERE `information_id` = ? AND `batch_no` = ?", [heads, weight, information_id, index])
      }

      const {
        rows
      } = await trxn.executeSqlAsync("SELECT * FROM `transactions` WHERE `information_id` = ?", [information_id])
      setTransactions(rows)
    })

    resetField("heads")
    resetField("weight")

    setIndex(null)
  }

  const onDelete = (data) => {
    db.transactionAsync(async (trxn) => {
      await trxn.executeSqlAsync("DELETE FROM `transactions` WHERE `information_id` = ? AND `batch_no` = ?", [data.information_id, data.batch_no])

      const {
        rows
      } = await trxn.executeSqlAsync("SELECT * FROM `transactions` WHERE `information_id` = ?", [data.information_id])
      setTransactions(rows)
    })
  }

  const onUpdate = (data) => {
    setIndex(data.batch_no)

    setValue("heads", data.heads.toString())
    setValue("weight", data.weight.toString())
  }

  const onCancel = () => {
    db.transactionAsync(async (trxn) => {
      await trxn.executeSqlAsync("DELETE FROM `informations` WHERE `id` = ?", [information.id])

      dispatch(resetInformationData())

      navigation.goBack()
    })
  }

  return (
    <ImageBackground style={styles.background} source={require('../../assets/dash.png')}>
      <SafeAreaView>
        <View style={styles.container}>
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 16, marginBottom: 16 }}>
            <View style={{ alignItems: "center", gap: 8 }}>
              <Text variant="labelLarge" style={{ color: "#646ECB", fontWeight: 700 }}>TOTAL ROWS</Text>

              <LinearGradient colors={['#9299DA', '#646ECB']} start={{ x: 0.5, y: 0.5 }} style={{ width: 108, height: 108, justifyContent: "center", alignItems: "center", borderRadius: 16 }}>
                <Text variant="displaySmall" style={{ color: "rgba(250,250,255,0.88)", fontWeight: 700 }}>
                  {transactions?.length}
                </Text>
              </LinearGradient>
            </View>

            <View style={{ alignItems: "center", gap: 8 }}>
              <Text variant="labelLarge" style={{ color: "#646ECB", fontWeight: 700 }}>TOTAL HEADS</Text>

              <LinearGradient colors={['#9299DA', '#646ECB']} start={{ x: 0.5, y: 0.5 }} style={{ width: 108, height: 108, justifyContent: "center", alignItems: "center", borderRadius: 16 }}>
                <Text variant="displaySmall" style={{ color: "rgba(250,250,255,0.88)", fontWeight: 700 }}>
                  {transactions.reduce((carry, item) => carry + parseInt(item.heads), 0)}
                </Text>
              </LinearGradient>
            </View>

            <View style={{ alignItems: "center", gap: 8 }}>
              <Text variant="labelLarge" style={{ color: "#646ECB", fontWeight: 700 }}>TOTAL WEIGHT</Text>

              <LinearGradient colors={['#9299DA', '#646ECB']} start={{ x: 0.5, y: 0.5 }} style={{ width: 108, height: 108, justifyContent: "center", alignItems: "center", borderRadius: 16 }}>
                <Text variant="displaySmall" style={{ color: "rgba(250,250,255,0.88)", fontWeight: 700 }}>
                  {transactions.reduce((carry, item) => carry + parseFloat(item.weight), 0)?.toFixed(1)}
                </Text>
              </LinearGradient>
            </View>
          </View>

          <View style={{ backgroundColor: "rgba(250,250,255,1)", minHeight: 36, flex: 1, elevation: 1, borderColor: "rgba(255,255,255,1)", borderWidth: 1, borderRadius: 16 }}>
            <View style={{ flexDirection: "row", marginBottom: 2, paddingTop: 8, paddingBottom: 8 }}>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text variant="labelLarge">LINE NO.</Text>
              </View>

              <View style={{ flex: 1, alignItems: "center" }}>
                <Text variant="labelLarge">HEADS</Text>
              </View>

              <View style={{ flex: 1, alignItems: "center" }}>
                <Text variant="labelLarge">WEIGHT</Text>
              </View>
            </View>

            <FlatList
              data={transactions}
              renderItem={({ item, index }) => (
                <Swipeable
                  ref={(ref) => item[index] = ref}
                  renderRightActions={() => (
                    <TouchableRipple onPress={() => { item[index].close(); onUpdate({ batch_no: item.batch_no, heads: item.heads, weight: item.weight }) }} borderless>
                      <View style={{ backgroundColor: "#646ECB", flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 4, paddingHorizontal: 16 }}>
                        <FeatherIcons name="feather" size={18} color="white" />
                        <Text variant="bodyMedium" style={{ color: "white", fontWeight: 700 }}>Edit</Text>
                      </View>
                    </TouchableRipple>
                  )}
                  renderLeftActions={() => (
                    <TouchableRipple style={{ flex: 1 }} onPress={() => { item[index].reset(); onDelete({ batch_no: item.batch_no, information_id: item.information_id }) }} borderless>
                      <View style={{ backgroundColor: "#EB5160", flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 4, paddingHorizontal: 16 }}>
                        <FeatherIcons name="trash" size={18} color="white" />
                        <Text variant="bodyMedium" style={{ color: "white", fontWeight: 700 }}>Remove</Text>
                      </View>
                    </TouchableRipple>
                  )}
                >
                  <View style={{ backgroundColor: "rgba(250,250,255,1)", flexDirection: "row", alignItems: "center", height: 42 }}>
                    <View style={{ flex: 1, alignItems: "center" }}>
                      <Text>{index + 1}</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: "center" }}>
                      <Text>{item.heads}</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: "center" }}>
                      <Text>{item.weight}</Text>
                    </View>
                  </View>
                </Swipeable>
              )}
              ItemSeparatorComponent={<Divider style={{ backgroundColor: "rgba(0,0,0,1)" }} />}
              ListEmptyComponent={
                <View style={{ flexDirection: "column", alignItems: "center", paddingVertical: 64 }}>
                  <FeatherIcons name="info" size={36} color="#EB5160" />
                  <Text variant="bodyLarge" style={{ fontWeight: 700, opacity: 0.88 }}>No records found!</Text>
                </View>
              }
              keyExtractor={(_, index) => index}
            />
          </View>

          <View style={{ flexDirection: "row", gap: 16, marginTop: 16 }}>
            <Controller
              name="heads"
              control={control}
              render={({ field: { value, onChange } }) => (
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <TextInput
                    label="Heads"
                    inputMode="numeric"
                    value={value}
                    onChangeText={onChange}
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: '#646ECB',
                      borderBottomWidth: 3,
                    }}
                    underlineStyle={{
                      display: 'none',
                    }}
                    left={
                      <TextInput.Icon
                        icon={({ color, size }) => <FeatherIcons name="tag" size={size} color={color} />}
                        size={26}
                      />
                    }
                  />

                  <HelperText type="error" visible={!!errors?.heads}>
                    {errors?.heads?.message}
                  </HelperText>
                </View>
              )}
            />

            <Controller
              name="weight"
              control={control}
              render={({ field: { value, onChange } }) => (
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <TextInput
                    label="Weight"
                    inputMode="decimal"
                    value={value}
                    onChangeText={onChange}
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: '#646ECB',
                      borderBottomWidth: 3,
                    }}
                    underlineStyle={{
                      display: 'none',
                    }}
                    left={
                      <TextInput.Icon
                        icon={({ color, size }) => <FeatherIcons name="compass" size={size} color={color} />}
                        size={26}
                      />
                    }
                  />

                  <HelperText type="error" visible={!!errors?.weight}>
                    {errors?.weight?.message}
                  </HelperText>
                </View>
              )}
            />
          </View>

          <Button mode="contained" buttonColor="#646ECB" style={{ borderRadius: 0 }} onPress={handleSubmit(onSubmit)}>Add</Button>

          <Divider style={{ marginVertical: 16 }} />

          <View style={{ gap: 8 }}>
            <Button mode="contained" icon={({ color, size }) => <FeatherIcons name="save" size={size} color={color} />} onPress={() => navigation.goBack()}>Save</Button>
            <Button mode="contained-tonal" icon={({ color, size }) => <FeatherIcons name="printer" size={size} color={color} />}>Print</Button>

            <Divider style={{ marginVertical: 8 }} />

            <Button mode="contained" buttonColor="#EB5160" onPress={() => bottomSheetRef.current.expand()}>Cancel</Button>
          </View>
        </View>
      </SafeAreaView>

      <InformationBottom navigation={navigation} />

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
            <Text variant="titleMedium">Are you sure you want cancel this transaction?</Text>

            <View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
              <Button mode="contained" onPress={onCancel}>Yes</Button>
              <Button onPress={() => bottomSheetRef.current.close()}>No</Button>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </ImageBackground >
  );
}

const InformationBottom = ({ navigation }) => {

  const db = SQLite.openDatabase("bionic.db")

  const dispatch = useDispatch()
  const localStorage = useLocalStorage()

  const bottomSheetRef = useRef(null);

  const {
    control,
    watch,
    handleSubmit,

    formState: { dirtyFields }
  } = useForm({
    resolver: yupResolver(informationSchema),
    defaultValues: {
      type: null,

      date_harvest: new Date(),

      category: null,
      farm: null,
      building: null,
      leadman: null,
      buyer: null,
      plate: null
    }
  })

  const [CATEGORIES, setCategories] = useState([])
  const [FARMS, setFarms] = useState([])
  const [BUILDINGS, setBuildings] = useState([])
  const [LEADMANS, setLeadmans] = useState([])
  const [BUYERS, setBuyers] = useState([])
  const [PLATES, setPlates] = useState([])

  useFocusEffect(
    useCallback(() => {
      (async () => {
        db.transactionAsync(async (trxn) => {
          const {
            rows: CATEGORIES_ROWS
          } = await trxn.executeSqlAsync("SELECT `id`, `name` FROM `categories` WHERE `deleted_at` IS NULL")
          setCategories(CATEGORIES_ROWS)

          const {
            rows: FARMS_ROWS
          } = await trxn.executeSqlAsync("SELECT `id`, `name` FROM `farms` WHERE `deleted_at` IS NULL")
          setFarms(FARMS_ROWS)

          const {
            rows: BUILDINGS_ROWS
          } = await trxn.executeSqlAsync("SELECT `id`, `name` FROM `buildings` WHERE `deleted_at` IS NULL")
          setBuildings(BUILDINGS_ROWS)

          const {
            rows: LEADMANS_ROWS
          } = await trxn.executeSqlAsync("SELECT `id`, `name` FROM `leadmans` WHERE `deleted_at` IS NULL")
          setLeadmans(LEADMANS_ROWS)

          const {
            rows: BUYERS_ROWS
          } = await trxn.executeSqlAsync("SELECT `id`, `name` FROM `buyers` WHERE `deleted_at` IS NULL")
          setBuyers(BUYERS_ROWS)

          const {
            rows: PLATES_ROWS
          } = await trxn.executeSqlAsync("SELECT `id`, `name` FROM `plates` WHERE `deleted_at` IS NULL")
          setPlates(PLATES_ROWS)
        })
      })()
    }, [navigation])
  )

  const { open: categoryOpen, onToggle: categoryToggle } = useDisclosure()
  const { open: farmOpen, onToggle: farmToggle } = useDisclosure()
  const { open: buildingOpen, onToggle: buildingToggle } = useDisclosure()
  const { open: leadmanOpen, onToggle: leadmanToggle } = useDisclosure()
  const { open: buyerOpen, onToggle: buyerToggle } = useDisclosure()
  const { open: plateOpen, onToggle: plateToggle } = useDisclosure()

  const onSubmit = (data) => {
    const {
      type,
      date_harvest,
      category: { id: category_id },
      farm: { id: farm_id },
      building: { id: building_id },
      leadman: { id: leadman_id },
      buyer: { id: buyer_id },
      plate: { id: plate_id }
    } = data

    db.transactionAsync(async (trxn) => {

      const harvested_at = dayjs(date_harvest).format("YYYY-MM-DD")

      const userData = await localStorage.getItem("user")
      const {
        id: user_id
      } = JSON.parse(userData)

      const seriesData = await trxn.executeSqlAsync("SELECT `id` FROM `informations` WHERE `harvested_at` = ?", [harvested_at])
      const series_no = dayjs(harvested_at).format("YYYYMMDD") +
        ++seriesData.rows.length

      const { insertId: id } = await trxn.executeSqlAsync("INSERT INTO `informations` (`user_id`, `category_id`, `farm_id`, `building_id`, `leadman_id`, `buyer_id`, `plate_id`, `type`, `series_no`, `harvested_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [user_id, category_id, farm_id, building_id, leadman_id, buyer_id, plate_id, type, series_no, harvested_at])

      dispatch(setInformationData({ id, user_id, category_id, farm_id, building_id, leadman_id, buyer_id, plate_id, type, series_no, harvested_at }))

      bottomSheetRef.current.close()
    })
  }

  return (
    <BottomSheet
      index={0}
      ref={bottomSheetRef}
      snapPoints={[184, 528]}
      enableContentPanningGesture={false}
      backdropComponent={(props) => <BottomSheetBackdrop {...props} pressBehavior="none" appearsOnIndex={0} disappearsOnIndex={-1} />}
    >
      <BottomSheetScrollView style={styles.contentContainer}>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <Controller
            name="type"
            control={control}
            render={({ field: { value, onChange } }) => {

              const onRadioButtonPress = () => {
                bottomSheetRef.current.snapToPosition(528)

                onChange("swine")
              }

              return (
                <View style={styles.radioContainer}>
                  <View style={[styles.radioBorder, value === "swine" && { borderColor: "#ff0462", borderWidth: 4, borderRadius: 128 }]}>
                    <TouchableRipple style={styles.radioButton} onPress={onRadioButtonPress} borderless>
                      <LinearGradient style={styles.radioGradient} colors={['#ff0462', '#fe9402']} start={{ x: 0, y: 0 }}>
                        <Image style={styles.radioImage} source={require('../../assets/swine.png')} />
                      </LinearGradient>
                    </TouchableRipple>
                  </View>

                  <Text variant="bodyLarge" style={{ ...(value === "swine" && { color: "#646ECB" }), fontWeight: 700 }}>Swine</Text>
                </View>
              )
            }}
          />

          <Controller
            name="type"
            control={control}
            render={({ field: { value, onChange } }) => {

              const onRadioButtonPress = () => {
                bottomSheetRef.current.snapToPosition(528)

                onChange("poultry")
              }

              return (
                <View style={styles.radioContainer}>
                  <View style={[styles.radioBorder, value === "poultry" && { borderColor: "#646ecb", borderWidth: 4, borderRadius: 128 }]}>
                    <TouchableRipple style={styles.radioButton} onPress={onRadioButtonPress} borderless>
                      <LinearGradient style={styles.radioGradient} colors={['#983cfe', '#37b2fa']} start={{ x: 1, y: 0 }}>
                        <Image style={styles.radioImage} source={require('../../assets/poultry.png')} />
                      </LinearGradient>
                    </TouchableRipple>
                  </View>


                  <Text variant="bodyLarge" style={{ ...(value === "poultry" && { color: "#646ECB" }), fontWeight: 700 }}>Poultry</Text>
                </View>
              )
            }}
          />
        </View>

        <View style={{ marginTop: 52, marginBottom: 52, paddingLeft: 16, paddingRight: 16, gap: 16 }}>
          <Controller
            name="date_harvest"
            control={control}
            render={({ field: { value, onChange }, fieldState: { isDirty } }) => {

              const onDatePickerPress = () => {
                DateTimePickerAndroid.open({
                  mode: "date",
                  value: value,
                  onChange: (_, date) => onChange(date)
                })
              }

              return (
                <TouchableOpacity onPress={onDatePickerPress}>
                  <View style={styles.datePicker}>
                    {
                      isDirty
                        ? <Text>{dayjs(value).format("DD/MM/YYYY")}</Text>
                        : <Text>Harvest Date</Text>
                    }

                    <FeatherIcons name="calendar" size={18} />
                  </View>
                </TouchableOpacity>
              )
            }}
          />

          <Controller
            name="category"
            control={control}
            render={({ field: { value, onChange } }) => (
              <DropDownPicker
                placeholder="Select Category"
                listMode="SCROLLVIEW"
                open={categoryOpen}
                value={value?.name}
                items={CATEGORIES}
                setOpen={categoryToggle}
                onSelectItem={onChange}
                schema={{ label: "name", value: "name" }}

                zIndex={999}
              />
            )}
          />

          <Controller
            name="farm"
            control={control}
            render={({ field: { value, onChange } }) => (
              <DropDownPicker
                placeholder="Select Farm"
                listMode="SCROLLVIEW"
                open={farmOpen}
                value={value?.name}
                items={FARMS}
                setOpen={farmToggle}
                onSelectItem={onChange}
                schema={{ label: "name", value: "name" }}

                zIndex={888}
              />
            )}
          />

          <Controller
            name="building"
            control={control}
            render={({ field: { value, onChange } }) => (
              <DropDownPicker
                placeholder="Select Building No."
                listMode="SCROLLVIEW"
                open={buildingOpen}
                value={value?.name}
                items={BUILDINGS}
                setOpen={buildingToggle}
                onSelectItem={onChange}
                schema={{ label: "name", value: "name" }}

                zIndex={777}
              />
            )}
          />

          <Controller
            name="leadman"
            control={control}
            render={({ field: { value, onChange } }) => (
              <DropDownPicker
                placeholder="Select Leadman"
                listMode="SCROLLVIEW"
                open={leadmanOpen}
                value={value?.name}
                items={LEADMANS}
                setOpen={leadmanToggle}
                onSelectItem={onChange}
                schema={{ label: "name", value: "name" }}

                zIndex={666}
              />
            )}
          />

          <Controller
            name="buyer"
            control={control}
            render={({ field: { value, onChange } }) => (
              <DropDownPicker
                placeholder="Select Buyer"
                listMode="SCROLLVIEW"
                open={buyerOpen}
                value={value?.name}
                items={BUYERS}
                setOpen={buyerToggle}
                onSelectItem={onChange}
                schema={{ label: "name", value: "name" }}

                zIndex={444}
              />
            )}
          />

          <Controller
            name="plate"
            control={control}
            render={({ field: { value, onChange } }) => (
              <DropDownPicker
                placeholder="Select Plate No."
                listMode="SCROLLVIEW"
                open={plateOpen}
                value={value?.name}
                items={PLATES}
                setOpen={plateToggle}
                onSelectItem={onChange}
                schema={{ label: "name", value: "name" }}

                zIndex={333}
              />
            )}
          />

          <Button
            mode="contained"
            disabled={
              !watch("type") ||
              !watch("category") ||
              !watch("farm") ||
              !watch("building") ||
              !watch("leadman") ||
              !watch("buyer") ||
              !watch("plate") ||
              !watch("date_harvest") ||
              !dirtyFields?.date_harvest
            }
            onPress={handleSubmit(onSubmit)}
          >
            Proceed
          </Button>

          <Button mode="contained" buttonColor="#EB5160" onPress={() => navigation.goBack()}>Cancel</Button>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover'
  },
  container: {
    flex: 1,
    padding: 24
  },
  contentContainer: {
    backgroundColor: "#effcff",
  },


  radioContainer: {
    alignItems: "center",
    gap: 8
  },
  radioBorder: {
    width: 116,
    height: 116,
    justifyContent: "center",
    alignItems: "center"
  },
  radioButton: {
    width: 100,
    height: 100,
    borderRadius: 52
  },
  radioGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 52
  },
  radioImage: {
    width: 64,
    height: 64
  },

  datePicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    backgroundColor: "#ffffff",
    minHeight: 50,
    paddingVertical: 3,
    paddingHorizontal: 10,

    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 8
  }
});

export default Transaction