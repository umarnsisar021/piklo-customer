import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange,
  removeOrientationListener
} from 'react-native-responsive-screen';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  gradient:{
    width:'100%',
    height:'100%'
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'column',
    flex:1,

    flexGrow:1,
    width:'80%',
  },

  phone:{
    flexDirection:'row',
    height:50,
    width:'100%',
    flexDirection:'row',
    backgroundColor:'#ffffff',
    borderRadius:12,
    borderWidth:1,
    borderColor:'#089e60'
  },
  flag:{
    width:'30%',
    height:'100%',
  },
  number: {
    width:'70%',
    height:'100%',
    fontSize:16,
    letterSpacing:1

  },
  appButtonContainer: {
    backgroundColor: "transparent",
    borderRadius: 8,
    borderColor:'#000',
    borderWidth:1,
    paddingVertical: 10,
    paddingHorizontal: 25
  },
  appButtonText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
    alignSelf: "center",
  },

  elevation:{
    width:'100%',
    backgroundColor:"#089e60",
    borderBottomRightRadius:wp("50%"),
    padding:30,paddingTop:30,
    paddingRight:50,

  }

});