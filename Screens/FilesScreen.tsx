import React, { Component,useState,useEffect } from 'react';
import { Button, View, StyleSheet,Text, Alert,FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
Icon.loadFont();
const FilesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    useEffect(() => {
        // Show the alert when the component mounts
        Alert.alert(
          "Please Connect to Marvel Wi-fi ",
          "you can't access files without wi-fi connection!",
          [
            {
              text: "OK",
              onPress: () => console.log("OK Pressed")
            }
          ]
        );
      }, []); // Empty dependency array ensures this runs once on mount
      const [selectedFile, setSelectedFile] = useState(null);
      const [files, setFiles] = useState([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');
    
      const pickFile = async () => {
          try {
              const result = await DocumentPicker.pickSingle({
                type: ['application/*', 'image/*', 'video/*'],
              });
              const { uri, type, name } = result;
                    // Log or use the file details
          console.log('URI:', uri);
          console.log('Type:', type);
          console.log('Name:', name);
    
          // Display file details in an alert (optional)
          Alert.alert('File Selected', `Name: ${name}\nType: ${type}\nURI: ${uri}`);
              if (!result.cancelled) {
                  setSelectedFile(result);
                  console.log("file pick",result);
              }
          } catch (err) {
              console.log('Error selecting file:', err);
          }
      };
    
      const uploadFile = async () => {
        try {
              if (!selectedFile) {
                  console.log('No file selected.');
                  return;
              }
              // const formData = new FormData();
              // formData.append('file', selectedFile);
              console.log('Here is my selected file ',selectedFile.name);
              let formData = new FormData();
              formData.append('file', {
                  uri: selectedFile.uri,
                  type: selectedFile.type,
                  name: selectedFile.name,
              });
              console.log('Here is my selected file1 ',selectedFile);
                console.log(formData);
              const response = await axios.post('http://192.168.4.1/upload', formData, {
                  headers: {
                      'Content-Type': 'multipart/form-data',
                  },
              });
              // console.log("beforeuploadmsg",setSelectedFile);
              console.log('File uploaded:', response.data);
          } catch (err) {
              console.error('Error uploading file:', err);
          }
      };
      const deleteFile = async () => {
        try {
          // setSelectedFile(filename);
          const response = await axios.post('http://192.168.4.1/delete', null, {
            params: { selectedFile }
          });
          Alert.alert('Success', response.data);
        } catch (error) {
          Alert.alert('Error', error.response ? error.response.data : error.message);
        }
      };
      const fetchFiles = async () => {
        setLoading(true);
        try {
          const response = await axios.get('http://192.168.4.1/list-files'); // Replace with ESP32 IP address
          const fileLines = response.data.split('\n').filter(line => line); // Splitting lines and filtering empty lines
          setFiles(fileLines);
          // const filenames = response.data.map(file => file.filename); // Adjust based on your API response structure
          //   setFiles(filenames);
          setError('');
        } catch (err) {
          setError('Error fetching data');
        } finally {
          setLoading(false);
        }
      };
      /*
      this is second option to display data in listview with select option
      */
    
      // Handle file selection
      const handleSelect = (filename) => {
        setSelectedFile(filename);
         Alert.alert('File Selected', `You selected: ${filename}`);
        // Alert.alert('File Selected', `You selected: ${filename}`, [
        //   {
        //     text: 'Select File',
        //     onPress: () => console.log('Ask me later pressed'),
        //   },
        //   {
        //     text: 'Delete',
        //     onPress: this.deleteFile,
        //     style: 'cancel',
        //   },
        //   {text: 'Cancel', onPress: () => console.log('OK Pressed')},
        // ]);
      };
    
      // Render each item in the list
      const renderItem = ({ item }) => (
        <TouchableOpacity 
          onPress={() => handleSelect(item)}
          style={[
            styles.itemContainer,
            item === selectedFile && styles.selectedItem
          ]}
        >
          <Text style={styles.itemText}>{item}
          <TouchableOpacity onPress={deleteFile}>
          <Text style={styles.buttonText}><Icon name="trash-o" size={20} color="#000" /></Text>
        </TouchableOpacity>
          </Text>
        </TouchableOpacity>
    
      );
    
      
    
    
    
      return (
          <View style={styles.container}>
              {loading && <Text>Loading...</Text>}
          {error && <Text style={styles.error}>{error}</Text>}
            <FlatList
            data={files}
            renderItem={renderItem}
            keyExtractor={(item) => item}
          />
          
          <Button title="List Files" onPress={fetchFiles} />
          
    
    
    {/* <ScrollView>
            {loading ? (
              <Text>Loading...</Text>
            ) : error ? (
              <Text>{error}</Text>
            ) : (
              <Text>{files}</Text>
            )}
            <Button title="List Files" onPress={fetchFiles} />
          </ScrollView> */}
    
    
         <View style={{flexDirection:'row', padding:5, paddingHorizontal: 5, marginHorizontal:10}}>
         <Button title="Select file" onPress={pickFile} /><Text> </Text>
            <Button title="Upload file" onPress={uploadFile} />
          
         </View>
            
        
    
          </View>
      );
    };
    export default FilesScreen;
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#EFDBFE',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
      },
      item: {
        padding: 10,
        fontSize: 16,
        height: 35,
      },
      error: {
        color: 'red',
      },
      itemContainer: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: '#fff',
      },
      itemText: {
        fontSize: 15,
      },
      selectedItem: {
        backgroundColor: '#e0f7fa',
      },
      deletefile:{
        width: 20,
      },
    });