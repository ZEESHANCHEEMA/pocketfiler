import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Dimensions,
  Linking,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import SaveSignature from './SaveSignature';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ChatCall,
  chatSendMsg,
  getChatHistory,
} from '../services/redux/middleware/Project/project';
import ScreenLoader from './loader/ScreenLoader';
import Toast from 'react-native-toast-message';

const {width, height} = Dimensions.get('window');

const UploadDocChat = ({
  title,
  headingid, //this is my project id
  headingtitle,
  image,
  imagePocket,
  imageCall,
  imageVideo,
}) => {
  const [inputText, setInputText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const navigation = useNavigation();
  const [userID, setId] = useState();
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardOpen(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardOpen(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  const closeModalAndNavigate = () => {
    setModalVisible(false);
    navigation.navigate('Dashboard');
  };
  const myCHat = useSelector(
    state => state?.getChathistory?.myChatHistory?.data,
  );

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userid = await AsyncStorage.getItem('_id');
        setId(userid);
      } catch (error) {
        console.error('Failed to fetch user id from AsyncStorage', error);
        // Handle error (e.g., show error message)
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    console.log('projectidd', headingid);
    dispatch(getChatHistory(headingid));
  }, []);

  async function SendMsg() {
    setLoader(true);
    try {
      const data = {
        projectId: headingid,
        userId: userID,
        msg: inputText,
      };

      dispatch(chatSendMsg(data)).then(res => {
        if (res?.payload?.status === 200) {
          console.log('my chat res', res);
          setLoader(false);
          console.log('Msg send success', res?.payload?.data);
          // SuccessToast("Message sent successfully");
          Toast.show({
            type: 'success',
            text1: 'Message Send Successfully',
            text2: 'Your msg has been send successfully',
            visibilityTime: 2000,
          });
          setInputText('');
          dispatch(getChatHistory(headingid));
        } else {
          setLoader(false);

          Toast.show({
            type: 'error',
            text1: 'Message Sending Failed',
            text2: res?.payload?.message || 'An error occurred',
            visibilityTime: 2000,
          });
        }
      });
    } catch (error) {
      console.error('Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Message Sending Failed',
        text2: error.message || 'An error occurred',
        visibilityTime: 2000,
      });
    }
  }
  const formatTime = createdAt => {
    if (!createdAt) return ''; // handle case where createdAt is undefined or null

    const date = new Date(createdAt);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be converted to 12

    // Padding minutes with zero if needed
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutes} ${ampm}`;
  };

  // const host = window.location.host;
  const host = 'https://pocketfiler.blockmob.io';
  // console.log("MY HOST IS", host);

  function generateRandomNumber(length) {
    const digits = '0123456789';
    let randomNumber = '';
    for (let i = 0; i < length; i++) {
      randomNumber += digits[Math.floor(Math.random() * digits.length)];
    }
    return randomNumber;
  }

  async function handleJoinAudioRoom() {
    setLoader(true);
    const uniqueAudioRoomID = generateRandomNumber(7);
    console.log('my unique room id', uniqueAudioRoomID);

    try {
      const data = {
        projectId: headingid,
        userId: userID,
        status: 'started',
        activity: 'Audio-Call',
        callUrl: `${host}/ProjectActivities-AudioCall/${uniqueAudioRoomID}?ProjectID=${headingid}`,
      };

      dispatch(ChatCall(data)).then(res => {
        if (res?.payload?.status === 200) {
          console.log('My audio call res', res);
          setLoader(false);
          console.log('Audio Call Data', res?.payload?.data);
          const dataaudio = {
            projectId: headingid,
            userId: userID,
            activityMsg: 'Audio-Call',

            msgUrl: `${host}/ProjectActivities-AudioCall/${uniqueAudioRoomID}?ProjectID=${headingid}`,
          };
          dispatch(chatSendMsg(dataaudio));
          const url = `${host}/ProjectActivities-AudioCall/${uniqueAudioRoomID}?ProjectID=${headingid}`;
          Linking.openURL(url).catch(err =>
            console.error('Failed to open URL', err),
          );
        } else {
          setLoader(false);
          Toast.show({
            type: 'error',
            text1: 'Audio Call Failure',
            text2: res?.payload?.message || 'An error occurred',
            visibilityTime: 2000,
          });
        }
      });
    } catch (error) {
      console.error('Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Audio-call Failed',
        text2: error.message || 'An error occurred',
        visibilityTime: 2000,
      });
    }
  }

  const handleClickCall = url => {
    if (url) {
      const fullUrl = url.startsWith('http') ? url : `http://${url}`;
      Linking.openURL(fullUrl).catch(err =>
        console.error('Failed to open URL:', err),
      );
    }
  };
  return (
    <ScrollView>
      <View style={styles.pocketFilerContainer}>
        <View style={styles.agent}>
          <View style={styles.left}>
            <View>
              <Image source={imagePocket} style={styles.imagePocket} />
            </View>
            <View style={styles.headingContainer}>
              <View>
                <Text style={styles.heading}>{headingtitle}</Text>
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
              </View>
            </View>
          </View>
          <View style={styles.call}>
            <TouchableOpacity onPress={handleJoinAudioRoom}>
              {/* <Text style={styles.text}>{text}</Text> */}
              <Image source={imageCall} style={styles.imageCall} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <Image source={imageVideo} style={styles.imageVideo} />
            </TouchableOpacity>
          </View>
        </View>
        {myCHat && myCHat.map((item, index) => (
            <>
              <View style={styles.chatBoxContainer}  key={index}>
                {item?.msg != null && (
                  <>
                    <View
                     
                      style={
                        item?.userId == userID
                          ? styles.chatBox
                          : styles.chatBlackBox
                      }>
                      <View>
                        <Image
                          source={{uri: item?.user?.profilePicture}}
                          style={styles.imageChat}
                        />
                      </View>
                      <View
                        style={
                          item?.userId == userID
                            ? styles.chat
                            : styles.blackChat
                        }>
                        <Text
                          style={
                            item?.userId == userID
                              ? styles.chatText
                              : styles.blackText
                          }>
                          {item?.msg}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.date}>
                      Today,{formatTime(item?.createdAt)}
                    </Text>
                  </>
                )}
                {item?.activityMsg != null && (
                  <TouchableOpacity
                    style={styles.activityContainer}
                    onPress={() => handleClickCall(item?.msgUrl)}>
                    <Text style={styles.title}>{item?.user?.fullname}</Text>
                    <Text style={styles.chatText}> started </Text>
                    <Text style={styles.chatText}>{item?.activityMsg}</Text>
                  </TouchableOpacity>
                )}

                {/* {item?.userId !== userID && (
                <>
                  <View style={styles.chatBlackBox}>
                    <View style={styles.blackChat}>
                      <Text style={styles.blackText}>{item?.msg}</Text>
                    </View>
                    <View>
                      <Image
                        source={{uri: item?.user?.profilePicture}}
                        style={styles.imageBlackChat}
                      />
                    </View>
                  </View>
                  <Text style={styles.blackDate}>Today,{blackDate}</Text>
                </>
              )} */}

                {/* <View style={styles.chatBox}>
                <View>
                  <Image source={imageChat} style={styles.imageChat} />
                </View>
                <View style={styles.chat}>
                  <Text style={styles.chatText}>{chat}</Text>
                </View>
              </View>
              <Text style={styles.date}> {date}</Text> */}

               
              </View>
              
            </>
          ))}
          <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type here ..."
                    placeholderTextColor="#858585"
                    keyboardType="default"
                  />
                  <TouchableOpacity onPress={SendMsg}>
                    <Image
                      source={require('../assets/images/client/pro.png')}
                      style={styles.inputIcon}
                    />
                  </TouchableOpacity>
                </View>
      </View>
      {/* save signature */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <SaveSignature
            image={image}
            title="Upload signature"
            onPress={() => setModalVisible(!modalVisible)}
            text="Save Signature"
          />
          closeModalAndNavigate={closeModalAndNavigate}
        </View>
      </Modal>
      <Toast ref={ref => Toast.setRef(ref)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  activityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  pocketFilerContainer: {
    width: width * 0.9,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'white',
    marginLeft: 20,
  },
  agent: {
    width: 350,
    height: 101,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEAEA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  left: {
    flexDirection: 'row',
  },
  headingContainer: {
    width: 145,
    height: 101,
    marginLeft: 8,
  },
  heading: {
    color: '#0A1126',
    fontSize: 14,
    fontFamily: 'ClashGrotesk-Medium',
  },
  imagePocket: {
    height: 30,
    width: 30,
  },
  titleContainer: {
    marginTop: 5,
  },
  title: {
    fontSize: 12,
    color: '#D32121',
    fontFamily: 'Poppins-Regular',
  },
  call: {
    flexDirection: 'row',
    width: 96,
  },
  imageCall: {
    width: 44,
    height: 44,
  },
  imageVideo: {
    width: 44,
    height: 44,
    marginLeft: 4,
  },
  text: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'ClashGrotesk-Regular',
  },

  chatBoxContainer: {
    width: width * 0.85,
    height: height * 0.99,
  },
  chatBox: {
    width: 252,
    height: 65,
    flexDirection: 'row',
    marginTop: 20,
  },
  imageChat: {
    width: 28,
    height: 28,
    marginRight: 10,
    marginTop: 15,
  },
  chat: {
    width: 200,
    height: 65,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBEAEA',
    padding: 10,
  },
  chatText: {
    color: '#0A1126',
    fontSize: 10,
    lineHeight: 14,
  },
  date: {
    color: '#858585',
    fontSize: 8,
    marginTop: 5,
    marginLeft: 50,
  },

  chatBlackBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  blackChat: {
    width: 200,
    height: 65,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBEAEA',
    padding: 10,
    backgroundColor: '#0A1126',
  },
  imageBlackChat: {
    width: 28,
    height: 28,
    marginLeft: 10,
    marginTop: 15,
  },
  blackText: {
    color: '#FFFFFF',
    fontSize: 10,
    lineHeight: 14,
    fontFamily: 'Poppins-Regular',
  },
  blackDate: {
    color: '#858585',
    fontSize: 8,
    textAlign: 'right',
    marginTop: 8,
    marginRight: 50,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#166FBF',
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 20,
    width: 300,
    height: 54,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#0A1126',
  },
  inputIcon: {
    width: 24,
    height: 24,
  },
  inputShifted: {
    marginTop: -520,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#166FBF',
    paddingLeft: 10,
    paddingRight: 10,
    width: 300,
    height: 54,
    backgroundColor: 'white',
  },
});

export default UploadDocChat;