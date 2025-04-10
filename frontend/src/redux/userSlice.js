
import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user : null,
        allUser: [],
        allChats: [],
        seletedChat:null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setAllUser: (state, action) => {
            state.allUser = action.payload;
        },
        setAllChats: (state, action) => {
            state.allChats= action.payload
        },
        setSelectedChats: (state, action) => {
            state.seletedChat= action.payload
        }
       
    }
})

export const {setUser, setAllUser, setAllChats, setSelectedChats} = userSlice.actions;
export default userSlice.reducer;