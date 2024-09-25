
import {io} from 'socket.io-client';
const url = 'http://192.168.1.7:9000'


export const socket = io(url, {autoConnect: false});
