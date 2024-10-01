import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ImageBackground, Image, Share } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import Panda from '../assets/gif/panda.gif';
import Background from '../assets/flipflopimage/background.png';
import Settings from './Settings';
import Flip from '../assets/flipflopimage/flip.png';
import Car from '../assets/flipflopimage/ca.png';
import Maze from '../assets/flipflopimage/maze.png';
import Maths from '../assets/flipflopimage/maths.png';
import Country from '../assets/flipflopimage/country.png';
import { fetchcoins, localCoinsFormStorage, updatecoin } from '../redux/features/coinSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function Home({ navigation }) {
  const dispatch = useDispatch();
  const [showIntro, setShowIntro] = useState(true);
  const coin = useSelector((state) => state.coin);
  console.log('coin value:', coin);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  
  


  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 });
    scale.value = withSpring(1, { damping: 15, stiffness: 100 });

    const timer = setTimeout(() => {
      scale.value = withTiming(0, { duration: 1000 });
      opacity.value = withTiming(0, { duration: 1000 });
      setTimeout(() => setShowIntro(false), 1000);
    }, 8000);

    return () => clearTimeout(timer);
  }, [scale, opacity]);

 useEffect(()=>{
    dispatch(fetchcoins())
 },[dispatch])

 

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: 'Check out this awesome game!',
        url: 'https://yourgameurl.com', // Replace with your app link or any content
        title: 'Brainzoe',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type
        } else {
          // Shared successfully
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <ImageBackground source={Background} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.coinBox}>
            <Text style={styles.coinText}><Icon name="cash-outline" size={24} color="#fff" /></Text>
            <Text style={styles.coinText}>{coin.coin}</Text>
          </View>

          <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
            <Icon name="person-circle-outline" size={36} color="#fff" />
            <Text style={styles.profileText}>Profile</Text>
          </TouchableOpacity>

          <Settings />
        </View>

        {showIntro && (
          <Animated.View style={[styles.overlay, animatedStyle]}>
            <View style={styles.popupContainer}>
              <FastImage source={Panda} style={styles.gif} resizeMode={FastImage.resizeMode.contain} />
              <Text style={styles.animatedText}>
                Hi, I’m Zoe! I've been using my phone a lot, and I need your help to keep my brain sharp and healthy. Let's play some fun games and learn together!
              </Text>
            </View>
          </Animated.View>
        )}

        <View style={styles.content}>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.button, styles.flipflopButton]} onPress={() => navigation.navigate('Flipflop')}>
              <Image source={Flip} style={styles.iconImage} />
              <Text style={styles.buttonText}>Flipflop</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.wordmatchButton]} onPress={() => navigation.navigate('Wordmatch')}>
              <Image source={Car} style={styles.iconImage} />
              <Text style={styles.buttonText}>Wordmatch</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.button, styles.mathsButton]} onPress={() => navigation.navigate('Maths')}>
              <Image source={Maths} style={styles.iconImage} />
              <Text style={styles.buttonText}>Maths</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.puzzleButton]} onPress={() => navigation.navigate('Puzzle')}>
              <Image source={Maze} style={styles.iconImage} />
              <Text style={styles.buttonText}>Puzzle</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.button, styles.countryButton]} onPress={() => navigation.navigate('Country')}>
              <Image source={Country} style={styles.iconImage} />
              <Text style={styles.buttonText}>Country</Text>
            </TouchableOpacity>
          </View>

          {/* Share Button */}
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#9575CD',
    borderRadius: 15,
    marginHorizontal: 10,
  },
  coinBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 5,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 5,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  popupContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
    zIndex: 3,
  },
  gif: {
    width: 100,
    height: 100,
    marginBottom: 10,
    zIndex: 4,
  },
  animatedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    zIndex: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    zIndex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    width: '100%',
    maxWidth: 400,
  },
  button: {
    flex: 1,
    height: 150,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    maxWidth: 150,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  iconImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
    marginBottom: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
