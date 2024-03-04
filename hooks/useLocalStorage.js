import AsyncStorage from "@react-native-async-storage/async-storage"

const useLocalStorage = () => {
  const setItem = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (error) {
      console.log("Async storage set item error: ", error)
    }
  }

  const getItem = async (key) => {
    try {
      return AsyncStorage.getItem(key)
    } catch (error) {
      console.log("Async storage get item error: ", error)
    }
  }

  const removeItem = async (key) => {
    try {
      return AsyncStorage.removeItem(key)
    } catch (error) {
      console.log("Async storage remove item error: ", error)
    }
  }

  return { setItem, getItem, removeItem }
}

export default useLocalStorage