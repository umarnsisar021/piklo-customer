import axios from 'axios'
import jwtDefaultConfig from './jwtDefaultConfig'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect, useSelector } from 'react-redux';
import { Alert } from 'react-native';

import { resolve } from 'url';
import setCookie from 'set-cookie-parser';
import { NativeModules } from 'react-native'
const Networking = NativeModules.Networking;

 class JwtService {

  token = "";
  // ** jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig }

  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = false

  // ** For Refreshing Token
  subscribers = []
  isRefreshCookie = false;
  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }
    // Add a request interceptor
    // ** Request Interceptor
    axios.interceptors.request.use(async config =>  {
        await Networking.clearCookies((cleared) => {});
        // ** Get token from localStorage
        const accessToken =  this.getToken();
        //config.headers = {'Access-Control-Allow-Origin': '*'}
        // ** If token is present add it to request's Authorization Header


           let c = await this.getValue();
           if (c !== null) {
              c = await c.replace(/\"/g, "");
              c = await c.replace("[", "");
              c = await c.replace("]", "");
              config.headers.cookie = c;
           }
        if (accessToken) {
          // ** eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
        }
        return config
      },
      error => Promise.reject(error)
    )


     // ** Add request/response interceptor

  }






  /// To set cookies in storage
  async storeData  (value) {
    try {
      await new Promise(async (res,rej)=>{
        let cookies, cookieHeader;
        cookieHeader = setCookie.splitCookiesString(value);
        cookies = setCookie.parse(cookieHeader);
        await AsyncStorage.setItem('@cookies', JSON.stringify(value));
        res(200)
      })
    } catch (e) {
      // saving error
    }
  }

   /// To set cookies in storage
   async clearData  () {
    try {
      await new Promise(async (res,rej)=>{
        await AsyncStorage.removeItem('@cookies');
        res(200)
      })
    } catch (e) {
      // saving error
    }
  }
  /// To get cookies from storage
  async getValue   () {
    let data = ""
    await new Promise(async (res, rej) => {
        const v = await AsyncStorage.getItem('@cookies');
        res(v)
      }).then((res)=>{
        data = res
      })
    return data
  }
  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter(callback => callback(accessToken))
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }


  getToken() {
    //return AsyncStorage.getItem(this.jwtConfig.storageTokenKeyName)
    return this.token
  }

  getRefreshToken() {
    return AsyncStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)
  }

  setToken(value) {

    this.token = value

  }

  getBaseUrl(){
    return this.jwtConfig.url
  }
   setRefreshCookies() {
     this.isRefreshCookie = true
   }
   exitRefreshCookies() {
     this.isRefreshCookie = false
   }

  setRefreshToken(value) {
    AsyncStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value)
  }

  login(...args) {
    return axios.post(this.jwtConfig.loginEndpoint, ...args)
  }

  register(...args) {
    return axios.post(this.jwtConfig.registerEndpoint, ...args)
  }

   refreshToken(data) {
    return this.post("drivers/Authentication/login",data)
  }

  async post (url, ...args) {
    return await axios.post(this.jwtConfig.host + url,...args)
  }
  async get(url, ...args) {
     return await axios.get(this.jwtConfig.host + url ,...args)
  }
}

function getLoginCreditials() {
  const data = useSelector(state => state.user.loginCredentials);
  return data;
}




const  useJwt = new JwtService();
export default new JwtService()

