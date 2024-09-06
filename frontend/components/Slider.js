import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, Image, StyleSheet, View, Dimensions, Text, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

const images = [
  { id: '1', uri: require('../assets/brain.png'), quote: "Grow Smart, Play Smart" },
  { id: '2', uri: require('../assets/cube.png'), quote: "Unlock Your Mind's Potential!" },
  { id: '3', uri: require('../assets/girl.png'), quote: "Focus, Fun, and Memory Magic!" },
];

function Slider({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState (0);

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={typeof item.uri === 'string' ? { uri: item.uri } : item.uri} style={styles.image} />
            <Text style={styles.quote}>{item.quote}</Text>
          </View>
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16} // Controls how often the scroll event is fired
      />
      <View style={styles.paginationContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { opacity: index === currentIndex ? 1 : 0.3 },
            ]}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFDD0', // Set a background color for the slider
    },
    imageContainer: {
      width,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 20, // Add padding at the bottom for the quote
      marginVertical: 20, // Add vertical margin to create space between items
    },
    image: {
      width: '70%', // Add some horizontal margin by reducing the image width
      height: 400, // Increase the height for a larger image
      resizeMode: 'cover',
      borderRadius: 10, // Optional: add rounded corners to the image
    },
    quote: {
      marginTop: 10,
      fontSize: 24, // Increased font size for better visibility
      fontWeight: 'bold', // Make the text bold
      textAlign: 'center',
      paddingHorizontal: 20, // Add horizontal padding for better readability
      paddingVertical: 10, // Add vertical padding for better readability
      borderRadius: 10, // Rounded corners for the quote background
      color: '#444',
      overflow: 'hidden', // Ensure text does not overflow out of the border radius
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 10,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#333',
      marginHorizontal: 5,
    },
    buttonContainer: {
      marginTop: 10,
      marginBottom: 10,
      marginHorizontal: 20,
      paddingVertical: 15,
      paddingHorizontal: 30,
      backgroundColor: '#007BFF', // Use a primary color for the button background
      borderRadius: 25, // Rounded corners
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5, // Add elevation for Android shadow
    },
    buttonText: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
    },
  });
  
  

export default Slider;
