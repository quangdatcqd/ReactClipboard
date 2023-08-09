import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import io from 'socket.io-client';
import { useState, useEffect, useCallback, useRef } from 'react';
import * as Clipboard from 'expo-clipboard';
// import * as BackgroundFetch from 'expo-background-fetch';
// import * as TaskManager from 'expo-task-manager';
export default function App() {
  const [IDRoom, setIDRoom] = useState("cqdgo")
  const socket = io("http://cqdplus.com/",{
    // reconnection:true
  })
  const idTimeout = useRef();
  const textClip = useRef("");
  const textsetClip = useRef("");
 
  const getStringClipboard = async () => {
    while (true) {
      Clipboard.getStringAsync().then(content => {

        if (textClip.current !== content) {
          socket.emit("copy", {
            ID: IDRoom,
            Message: content
          });
          textClip.current = content;
          console.log('Copied: ' + content)

        }
      });

      await delay();
    }
  }

  async function delay() {
    return new Promise((resolve, reject) => {
      return setTimeout(resolve, 2000);
    })
  } 
  useEffect(async() => {

 
    // getStringClipboard();
    socket.on("copy", async (data) => {

      if (textsetClip.current !== data) {
        console.log('set: ' + data)
        await Clipboard.setStringAsync(data);
        textsetClip.current = data;
      }

    })
    socket.emit("joinRoom", {
      ID: IDRoom,
      Message: "join"
    })
    return () => clearInterval(idTimeout.current)
  }, [])




  const handleChangeID = (e) => {
    debounceSearch(e.toLowerCase())
  }

  const debounceSearch = useCallback(debounce((value) => {
    setIDRoom(value);
    socket.emit("joinRoom", {
      ID: value,
      Message: "join"
    })
  }, 1000), []);


  function debounce(func, delay) {
    let timer;
    return function (...args) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={{
        width: 250,
        textAlign: "left"
      }} >ID ROOM</Text>
      <TextInput style={{
        borderColor: "#5d5cde",
        borderWidth: 2,
        paddingHorizontal: 10,
        width: 250,
        borderRadius: 8
      }}
        defaultValue={IDRoom}
        onChangeText={(e) => handleChangeID(e)} />
      <StatusBar style="auto" />
      <Text style={{
        width: 250,
        textAlign: "left",
        marginTop: 5
      }} >CURRENT ID: {IDRoom}</Text>


      <TextInput style={{
        borderColor: "#5d5cde",
        borderWidth: 2,
        paddingHorizontal: 10,
        width: 250,
        borderRadius: 8
      }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
