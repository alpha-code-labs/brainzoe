
import {io} from 'socket.io-client';
const url = 'http://192.168.1.14:9001'


export const socket = io(url, {autoConnect: false});
