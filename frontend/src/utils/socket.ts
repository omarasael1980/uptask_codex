import { io } from "socket.io-client";

const apiUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:4100/api/v1";
const socketUrl = import.meta.env.VITE_SOCKET_URL ?? apiUrl.replace(/\/api\/v\d+\/?$/, "");

const socket = io(socketUrl);

export default socket;
