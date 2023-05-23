import axios from "axios";

const addCommand = async (command) => {
    const response = await axios.post("/api/create-command", command);

    return response.data;
}

const addCommands = async (commands) => {
    const response = await axios.post("/api/create-multiple-command", commands);

    return response.data;
}

const removeCommand = async (id) => {
    const response = await axios.delete(`/api/remove-command?id=${id}`);

    return response.data;
}

const search = async (query) => {
    const response = await axios.get(`/api/search?query=${query}`);

    return response.data;
}

const getAllCommands = async () => {
    const response = await axios.get("/api/commands");

    return response.data;
}

const isAuthenticated = async () => {
    const response = await axios.get("/api/is-authenticated");

    return response.data;
}

export {
    addCommand,
    addCommands,
    removeCommand,
    search,
    getAllCommands,
    isAuthenticated,
}