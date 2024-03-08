import { useCallback, useEffect, useState } from 'react'

import { useFocusEffect } from '@react-navigation/native'

import * as yup from 'yup'

import * as SQLite from 'expo-sqlite'

import * as LocalAuthentication from 'expo-local-authentication'

import { yupResolver } from '@hookform/resolvers/yup'

import { Controller, useForm } from 'react-hook-form'

import { useDispatch } from 'react-redux'
import { setUserData } from '../../features/user/user.slice'

import {
  View,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView
} from 'react-native'

import {
  Button,
  HelperText,
  Text,
  TextInput
} from 'react-native-paper'

import FeatherIcons from '@expo/vector-icons/Feather'

import useToast from '../../hooks/useToast'
import useDisclosure from '../../hooks/useDisclosure'
import useLocalStorage from '../../hooks/useLocalStorage'

import SafeAreaView from '../../components/SafeAreaView'

import Bcrypt from 'bcryptjs'

const schema = yup.object().shape({
  username: yup.string().required().label("Username"),
  password: yup.string().required().label("Password")
})

const Login = ({ navigation }) => {

  const db = SQLite.openDatabase("bionic.db")

  const toast = useToast()
  const dispatch = useDispatch()
  const localStorage = useLocalStorage()

  const {
    control,
    reset,
    handleSubmit,

    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    }
  })

  const { open: visible, onToggle: togglePasswordVisibility } = useDisclosure(true)

  const [isLoading, setIsLoading] = useState(false)
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false)
  // const [isBiometricSupported, setIsBiometricSupported] = useState(false)

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const biometric = await localStorage.getItem("isBiometricEnabled")

        if (biometric) {
          setIsBiometricEnabled(!!parseInt(biometric))
        }
      })()
    }, [navigation])
  )

  // useEffect(() => {
  //   db.transaction((txn) => {
  //     txn.executeSql("DROP TABLE `users`", null, (_, result) => console.log(result), (_, error) => console.log(error))
  //   })

  //   db.transaction((txn) => {
  //     txn.executeSql("CREATE TABLE IF NOT EXISTS `users` (`id` INTEGER PRIMARY KEY, `fullname` VARCHAR(255) NOT NULL, `username` VARCHAR(255) NOT NULL UNIQUE, `password` VARCHAR(255) NOT NULL, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP)", null, (_, result) => console.log(result), (_, error) => console.log(error))
  //   })

  //   db.transaction((txn) => {
  //     txn.executeSql("INSERT INTO `users` (`fullname`, `username`, `password`) values (?, ?, ?)", ["Limayy Ducut", "llducut", "$2y$10$qQRHkqYiS2rrsVjU4sDTiOSkhSDzAvCPjWmV6D.fUkbXfyhMQPKAq"],
  //       (_, result) => {
  //         console.log(result.rows._array)
  //       },
  //       (_, error) => {
  //         console.log(error)
  //       })
  //   })


  //   db.transaction((txn) => {
  //     txn.executeSql(
  //       "SELECT * FROM `users` WHERE `username` = ?",
  //       ["llducut"],
  //       (_, result) => {
  //         const { password } = result.rows._array.at(0)

  //         console.log(bcrypt.compareSync("1234", password))
  //       },
  //       (_, error) => {
  //         console.log(error)
  //       }
  //     )
  //   })

  //   bcrypt.setRandomFallback((data) => {
  //     const buf = new Uint8Array(data);

  //     return buf.map(() => Math.floor(isaac.random() * 256));
  //   })

  //   bcrypt.genSalt(10, (err, salt) => {
  //     bcrypt.hash("1234", salt, (err, hash) => {
  //       console.log(bcrypt.compareSync("1234", hash))
  //     })
  //   })

  //   db.transactionAsync(async (txn) => {
  //     const res = await txn.executeSqlAsync("SELECT * FROM `users` WHERE `username` = ?", ["llducut"])

  //     console.log("res: ", res)
  //   })

  // }, [])

  // useEffect(() => {
  //   (async () => {
  //     const compatible = await LocalAuthentication.hasHardwareAsync()

  //     setIsBiometricSupported(compatible)
  //   })()
  // }, [])

  const onSubmit = (data) => {
    setIsLoading(true)

    db.transactionAsync(async (trxn) => {
      try {
        const { rows } = await trxn.executeSqlAsync("SELECT * FROM `users` WHERE `username` = ?", [data.username])

        if (rows.length === 0) {
          throw new Error("Invalid username or password.")
        }

        const { password, ...userData } = rows.at(0)

        const compareAsync = (string, hash) => {
          return new Promise((resolve, reject) => {
            Bcrypt.compare(string, hash, (error, result) => {
              if (error) {
                reject(error)
              }

              resolve(result)
            })
          })
        }

        const match = await compareAsync(data.password, password)

        if (match) {
          localStorage.setItem("user", JSON.stringify(userData))

          dispatch(setUserData(userData))

          reset()
          setIsLoading(false)

          return navigation.navigate("Dashboard")
        }

        throw new Error("Invalid username or password.")
      } catch (error) {
        setIsLoading(false)

        toast({ message: error.message })
      }
    })
  }

  const signBiometricHandler = async () => {
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync()
    if (!isBiometricAvailable) {
      return toast({ message: "Biometric auth is not available." })
    }

    const isBiometricSaved = await LocalAuthentication.isEnrolledAsync()
    if (!isBiometricSaved) {
      return toast({ message: "No biometric found." })
    }

    const auth = await LocalAuthentication.authenticateAsync()

    if (auth.success) {
      const userData = await localStorage.getItem("user").then((data) => JSON.parse(data))

      dispatch(setUserData(userData))

      navigation.navigate("Dashboard")
    }
  }

  return (
    <ImageBackground style={styles.background} source={require('../../assets/sign.png')}>
      <SafeAreaView>
        <View style={styles.container}>
          <Text variant="headlineLarge" style={{ fontWeight: 700, letterSpacing: 2, marginTop: 16, marginLeft: 8 }}>Welcome back</Text>

          <KeyboardAvoidingView behavior="padding" enabled>
            <Controller
              control={control}
              name="username"
              render={({ field: { value, onChange } }) => (
                <View>
                  <TextInput
                    label="Username"
                    mode="flat"
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
                        icon={({ color, size }) => <FeatherIcons name="user" size={size} color={color} />}
                        size={20}
                        forceTextInputFocus={false}
                      />
                    }
                    dense
                  />

                  <HelperText type="error" visible={!!errors?.username}>
                    {errors?.username?.message}
                  </HelperText>
                </View>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange } }) => (
                <View>
                  <TextInput
                    label="Password"
                    value={value}
                    secureTextEntry={visible}
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
                        icon={({ color, size }) => <FeatherIcons name="lock" size={size} color={color} />}
                        size={20}
                        forceTextInputFocus={false}
                      />
                    }
                    right={
                      <TextInput.Icon
                        icon={({ color, size }) => <FeatherIcons name="eye" size={size} color={color} />}
                        size={20}
                        onPress={togglePasswordVisibility}
                      />
                    }
                    underlineColor="#646ECB"
                    dense
                  />

                  <HelperText type="error" visible={!!errors?.password}>
                    {errors?.password?.message}
                  </HelperText>
                </View>
              )}
            />

            <Button mode="contained" loading={isLoading} style={{ marginTop: 64, padding: 2, borderRadius: 6 }} onPress={handleSubmit(onSubmit)}>
              <Text variant="bodyMedium" style={{ color: '#f0f0e1', fontWeight: 'bold' }}>Log in</Text>
            </Button>

            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginVertical: 12, paddingHorizontal: 32, opacity: 0.3 }}>
              <View style={{ flexGrow: 1, height: 1, marginRight: 8, backgroundColor: '#000000' }} />
              <Text>or</Text>
              <View style={{ flexGrow: 1, height: 1, marginLeft: 8, backgroundColor: '#000000' }} />
            </View>

            <Button
              mode="outlined"
              disabled={!isBiometricEnabled}
              style={{
                padding: 2,
                borderRadius: 6,
                borderColor: '#646ecb',
                ...(!isBiometricEnabled && { opacity: 0.64 })
              }}
              onPress={signBiometricHandler}
            >
              <Text variant="bodyMedium" style={{ color: '#646ecb', fontWeight: 'bold' }}>Biometric</Text>
            </Button>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
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
  }
})

export default Login