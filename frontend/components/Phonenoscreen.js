// import React, { useState } from 'react';
// import { SafeAreaView, View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
// import firebase from '@react-native-firebase/app';
// import firestore from '@react-native-firebase/firestore';

// // Initialize Firebase
// if (!firebase.apps.length) {
//   firebase.initializeApp({
//     // Your Firebase configuration here
//   });
// }

// const PhoneNoScreen = ({ navigation }) => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [loading, setLoading] = useState(false);  // Loading state

//   const isValidPhoneNumber = (number) => {
//     const phoneNumberPattern = /^\d{10}$/;
//     return phoneNumberPattern.test(number);
//   };

//   const handleNextPress = async () => {
//     if (isValidPhoneNumber(phoneNumber)) {
//       setLoading(true);  // Set loading to true

//       try {
//         // Save the phone number to Firestore
//         await firestore().collection('phoneNumbers').add({
//           phoneNumber,
//         });
//         navigation.navigate('Home');
//       } catch (error) {
//         console.error("Error saving phone number to Firestore: ", error);
//         alert('Failed to save phone number. Please try again.');
//       } finally {
//         setLoading(false);  // Set loading to false once done
//       }
//     } else {
//       alert('Please enter a valid 10-digit phone number.');
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Enter your phone number:</Text>
//         <TextInput
//           style={styles.input}
//           keyboardType="numeric"
//           maxLength={10}
//           placeholder="Phone Number"
//           value={phoneNumber}
//           onChangeText={setPhoneNumber}
//         />
//         {!loading ? (
//           <TouchableOpacity
//             style={[
//               styles.button,
//               { backgroundColor: isValidPhoneNumber(phoneNumber) ? '#007BFF' : '#cccccc' },
//             ]}
//             onPress={handleNextPress}
//             disabled={!isValidPhoneNumber(phoneNumber)}
//           >
//             <Text style={styles.buttonText}>Next</Text>
//           </TouchableOpacity>
//         ) : (
//           <ActivityIndicator
//             size="large"
//             color="#007BFF"
//             style={styles.loader}
//           />
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '##FFFFFF',
//     color: '#000000',
//   },
//   inputContainer: {
//     width: '85%',
//     padding: 30,
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//     color: '#000000',
//   },
//   label: {
//     fontSize: 18,
//     marginBottom: 15,
//     fontWeight: 'bold',
//     color: '#000000',
//   },
//   input: {
//     height: 50,
//     borderColor: '#dddddd',
//     borderWidth: 1,
//     borderRadius: 8,
//     marginBottom: 20,
//     paddingHorizontal: 15,
//     fontSize: 18,
//     color:'#000000'

//   },
//   button: {
//     paddingVertical: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   loader: {
//     marginTop: 20,
//   },
// });

// export default PhoneNoScreen;

// import React, { useState } from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   StyleSheet,
//   ActivityIndicator,
//   Modal,
//   ScrollView,
//   Linking,
// } from 'react-native';
// import firebase from '@react-native-firebase/app';
// import firestore from '@react-native-firebase/firestore';

// // Initialize Firebase
// if (!firebase.apps.length) {
//   firebase.initializeApp({
//     // Your Firebase configuration here
//   });
// }

// const PhoneNoScreen = ({ navigation }) => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalContent, setModalContent] = useState('');

//   const isValidPhoneNumber = (number) => {
//     const phoneNumberPattern = /^\d{10}$/;
//     return phoneNumberPattern.test(number);
//   };

//   const handleNextPress = async () => {
//     if (isValidPhoneNumber(phoneNumber)) {
//       setLoading(true);
//       try {
//         await firestore().collection('phoneNumbers').add({
//           phoneNumber,
//         });
//         navigation.navigate('Home');
//       } catch (error) {
//         console.error("Error saving phone number to Firestore: ", error);
//         alert('Failed to save phone number. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       alert('Please enter a valid 10-digit phone number.');
//     }
//   };

//   const showModal = (content) => {
//     setModalContent(content);
//     setModalVisible(true);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.inputContainer}>
//         <Text style={styles.headerText}>Enter your mobile number</Text>
//         <TextInput
//           style={styles.input}
//           keyboardType="numeric"
//           maxLength={10}
//           placeholder="Enter your number"
//           value={phoneNumber}
//           onChangeText={setPhoneNumber}
//           placeholderTextColor="#666666"
//         />
//         {!loading ? (
//           <TouchableOpacity
//             style={[
//               styles.button,
//               { backgroundColor: isValidPhoneNumber(phoneNumber) ? '#007BFF' : '#cccccc' },
//             ]}
//             onPress={handleNextPress}
//             disabled={!isValidPhoneNumber(phoneNumber)}
//           >
//             <Text style={styles.buttonText}>Continue</Text>
//           </TouchableOpacity>
//         ) : (
//           <ActivityIndicator
//             size="large"
//             color="#007BFF"
//             style={styles.loader}
//           />
//         )}
//         <Text style={styles.termsText}>
//           By continuing, you agree to our{' '}
//           <Text style={styles.linkText} onPress={() => showModal('terms')}>
//             Terms of Service
//           </Text>{' '}
//           &{' '}
//           <Text style={styles.linkText} onPress={() => showModal('privacy')}>
//             Privacy Policy
//           </Text>
//           .
//         </Text>
//       </View>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           setModalVisible(!modalVisible);
//         }}
//       >
//         <SafeAreaView style={styles.modalContainer}>
//           <View style={styles.modalView}>
//             <ScrollView contentContainerStyle={styles.modalContent}>
//               <Text style={styles.modalHeader}>
//                 {modalContent === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
//               </Text>
//               <Text style={styles.modalText}>
//                 {modalContent === 'terms' ? (
//                   `
// These terms and conditions applies to the Brainzoe app (hereby referred to as "Application") for mobile devices that was created by Alpha Code Labs (hereby referred to as "Service Provider") as a Free service.

// Upon downloading or utilizing the Application, you are automatically agreeing to the following terms. It is strongly advised that you thoroughly read and understand these terms prior to using the Application. Unauthorized copying, modification of the Application, any part of the Application, or our trademarks is strictly prohibited. Any attempts to extract the source code of the Application, translate the Application into other languages, or create derivative versions are not permitted. All trademarks, copyrights, database rights, and other intellectual property rights related to the Application remain the property of the Service Provider.

// The Service Provider is dedicated to ensuring that the Application is as beneficial and efficient as possible. As such, they reserve the right to modify the Application or charge for their services at any time and for any reason. The Service Provider assures you that any charges for the Application or its services will be clearly communicated to you.

// The Application stores and processes personal data that you have provided to the Service Provider in order to provide the Service. It is your responsibility to maintain the security of your phone and access to the Application. The Service Provider strongly advise against jailbreaking or rooting your phone, which involves removing software restrictions and limitations imposed by the official operating system of your device. Such actions could expose your phone to malware, viruses, malicious programs, compromise your phone's security features, and may result in the Application not functioning correctly or at all.

// Please note that the Application utilizes third-party services that have their own Terms and Conditions. Below are the links to the Terms and Conditions of the third-party service providers used by the Application:

// Google Play Services
// Google Analytics for Firebase
// Firebase Crashlytics

// Please be aware that the Service Provider does not assume responsibility for certain aspects. Some functions of the Application require an active internet connection, which can be Wi-Fi or provided by your mobile network provider. The Service Provider cannot be held responsible if the Application does not function at full capacity due to lack of access to Wi-Fi or if you have exhausted your data allowance.

// If you are using the application outside of a Wi-Fi area, please be aware that your mobile network provider's agreement terms still apply. Consequently, you may incur charges from your mobile provider for data usage during the connection to the application, or other third-party charges. By using the application, you accept responsibility for any such charges, including roaming data charges if you use the application outside of your home territory (i.e., region or country) without disabling data roaming. If you are not the bill payer for the device on which you are using the application, they assume that you have obtained permission from the bill payer.

// Similarly, the Service Provider cannot always assume responsibility for your usage of the application. For instance, it is your responsibility to ensure that your device remains charged. If your device runs out of battery and you are unable to access the Service, the Service Provider cannot be held responsible.

// In terms of the Service Provider's responsibility for your use of the application, it is important to note that while they strive to ensure that it is updated and accurate at all times, they do rely on third parties to provide information to them so that they can make it available to you. The Service Provider accepts no liability for any loss, direct or indirect, that you experience as a result of relying entirely on this functionality of the application.

// The Service Provider may wish to update the application at some point. The application is currently available as per the requirements for the operating system (and for any additional systems they decide to extend the availability of the application to) may change, and you will need to download the updates if you want to continue using the application. The Service Provider does not guarantee that it will always update the application so that it is relevant to you and/or compatible with the particular operating system version installed on your device. However, you agree to always accept updates to the application when offered to you. The Service Provider may also wish to cease providing the application and may terminate its use at any time without providing termination notice to you. Unless they inform you otherwise, upon any termination, (a) the rights and licenses granted to you in these terms will end; (b) you must cease using the application, and (if necessary) delete it from your device.

// Changes to These Terms and Conditions
// The Service Provider may periodically update their Terms and Conditions. Therefore, you are advised to review this page regularly for any changes. The Service Provider will notify you of any changes by posting the new Terms and Conditions on this page.

// These terms and conditions are effective as of 2024-08-07

// Contact Us
// If you have any questions or suggestions about the Terms and Conditions, please do not hesitate to contact the Service Provider at aclinnovate@gmail.com
//                   `
//                 ) : (
//                   `Privacy Policy
// This privacy policy applies to the Brainzoe app (hereby referred to as "Application") for mobile devices that was created by Alpha Code Labs (hereby referred to as "Service Provider") as a Free service. This service is intended for use "AS IS".

// Information Collection and Use
// The Application collects information when you download and use it. This information may include information such as

// Your device's Internet Protocol address (e.g. IP address)
// The pages of the Application that you visit, the time and date of your visit, the time spent on those pages
// The time spent on the Application
// The operating system you use on your mobile device

// The Application does not gather precise information about the location of your mobile device.

// The Service Provider may use the information you provided to contact you from time to time to provide you with important information, required notices and marketing promotions.

// For a better experience, while using the Application, the Service Provider may require you to provide us with certain personally identifiable information, including but not limited to aclinnovate@gmail.com,male, 42. The information that the Service Provider request will be retained by them and used as described in this privacy policy.

// Third Party Access
// Only aggregated, anonymized data is periodically transmitted to external services to aid the Service Provider in improving the Application and their service. The Service Provider may share your information with third parties in the ways that are described in this privacy statement.

// Please note that the Application utilizes third-party services that have their own Privacy Policy about handling data. Below are the links to the Privacy Policy of the third-party service providers used by the Application:

// Google Play Services
// Google Analytics for Firebase
// Firebase Crashlytics

// The Service Provider may disclose User Provided and Automatically Collected Information:

// as required by law, such as to comply with a subpoena, or similar legal process;
// when they believe in good faith that disclosure is necessary to protect their rights, protect your safety or the safety of others, investigate fraud, or respond to a government request;
// with their trusted services providers who work on their behalf, do not have an independent use of the information we disclose to them, and have agreed to adhere to the rules set forth in this privacy statement.

// Opt-Out Rights
// You can stop all collection of information by the Application easily by uninstalling it. You may use the standard uninstall processes as may be available as part of your mobile device or via the mobile application marketplace or network.

// Data Retention Policy
// The Service Provider will retain User Provided data for as long as you use the Application and for a reasonable time thereafter. If you'd like them to delete User Provided Data that you have provided via the Application, please contact them at aclinnovate@gmail.com and they will respond in a reasonable time.

// Children
// The Service Provider does not use the Application to knowingly solicit data from or market to children under the age of 13.

// The Application does not address anyone under the age of 13. The Service Provider does not knowingly collect personally identifiable information from children under 13 years of age. In the case the Service Provider discover that a child under 13 has provided personal information, the Service Provider will immediately delete this from their servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact the Service Provider (aclinnovate@gmail.com) so that they will be able to take the necessary actions.

// Security
// The Service Provider is concerned about safeguarding the confidentiality of your information. The Service Provider provides physical, electronic, and procedural safeguards to protect information the Service Provider processes and maintains.

// Changes
// This Privacy Policy may be updated from time to time for any reason. The Service Provider will notify you of any changes to the Privacy Policy by updating this page with the new Privacy Policy. You are advised to consult this Privacy Policy regularly for any changes, as continued use is deemed approval of all changes.

// This privacy policy is effective as of 2024-08-07

// Your Consent
// By using the Application, you are consenting to the processing of your information as set forth in this Privacy Policy now and as amended by us.

// Contact Us
// If you have any questions regarding privacy while using the Application, or have questions about the practices, please contact the Service Provider via email at aclinnovate@gmail.com.  `
//                 )}
//               </Text>
//             </ScrollView>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => setModalVisible(!modalVisible)}
//             >
//               <Text style={styles.closeButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </SafeAreaView>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFFDD0',
//   },
//   inputContainer: {
//     width: '85%',
//     padding: 30,
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   headerText: {
//     fontSize: 18,
//     marginBottom: 15,
//     fontWeight: 'bold',
//     color: '#000000',
//     textAlign: 'left',
//   },
//   input: {
//     height: 50,
//     borderColor: '#dddddd',
//     borderWidth: 1,
//     borderRadius: 8,
//     marginBottom: 20,
//     paddingHorizontal: 15,
//     fontSize: 18,
//     color: '#333333',
//     backgroundColor: '#F9F9F9',
//   },
//   button: {
//     paddingVertical: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   loader: {
//     marginTop: 20,
//   },
//   termsText: {
//     marginTop: 20,
//     fontSize: 14,
//     color: '#000000',
//     textAlign: 'center',
//   },
//   linkText: {
//     color: '#007BFF',
//     textDecorationLine: 'underline',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalView: {
//     width: '90%',
//     maxHeight: '80%',
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 20,
//     alignItems: 'center',
//   },
//   modalContent: {
//     paddingVertical: 10,
//     color: '#000000',
//   },
//   modalHeader: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#000000',
//   },
//   modalText: {
//     fontSize: 16,
//     lineHeight: 24,
//     color: '#000000',
//   },
//   closeButton: {
//     marginTop: 15,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: '#007BFF',
//     borderRadius: 8,
//   },
//   closeButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default PhoneNoScreen;

import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
  Linking,
} from 'react-native';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp({
    // Your Firebase configuration here
  });
}

const PhoneNoScreen = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const isValidPhoneNumber = number => {
    const phoneNumberPattern = /^\d{10}$/;
    return phoneNumberPattern.test(number);
  };

  const handleNextPress = async () => {
    if (isValidPhoneNumber(phoneNumber)) {
      setLoading(true);
      try {
        await firestore().collection('phoneNumbers').add({
          phoneNumber,
        });
        navigation.navigate('Home');
      } catch (error) {
        console.error('Error saving phone number to Firestore: ', error);
        alert('Failed to save phone number. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please enter a valid 10-digit phone number.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.headerText}>Enter your mobile number</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          maxLength={10}
          placeholder="Enter your number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholderTextColor="#666666"
        />
        {!loading ? (
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isValidPhoneNumber(phoneNumber)
                  ? '#007BFF'
                  : '#cccccc',
              },
            ]}
            onPress={handleNextPress}
            disabled={!isValidPhoneNumber(phoneNumber)}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        ) : (
          <ActivityIndicator
            size="large"
            color="#007BFF"
            style={styles.loader}
          />
        )}
        <Text style={styles.termsText}>
          By continuing, you agree to our{' '}
          <Text
            style={styles.linkText}
            onPress={() =>
              Linking.openURL('https://brainzoe.vercel.app/privacy')
            }>
            Privacy Policy
          </Text>
          .
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFDD0',
  },
  inputContainer: {
    width: '85%',
    padding: 30,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerText: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'left',
  },
  input: {
    height: 50,
    borderColor: '#dddddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 18,
    color: '#333333',
    backgroundColor: '#F9F9F9',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
  termsText: {
    marginTop: 20,
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
  },
  linkText: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});

export default PhoneNoScreen;
