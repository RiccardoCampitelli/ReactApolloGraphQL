import React, { createContext , useReducer} from 'react'
import jwtDecode from 'jwt-decode';

const initialState = {
    user: null
}

if(localStorage.getItem("jwtToken")){
    const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));

    if(decodedToken.exp * 1000 < Date.now()){
        localStorage.removeItem("jwtToken")
    }
    else{
        initialState.user = decodedToken;
    }
}

const AuthContext = createContext({
    user: null,
    login: (userData) => {},
    logout: (callBack) => {} 
})


function AuthReducer (state, action ) {
    switch(action.type){
        case 'LOGIN':
            return {
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return{
                ...state,
                user:null
            }

        default:
            return state;
    }
}

function AuthProvider(props) {
    const [state, dispatch] = useReducer(AuthReducer, initialState)

    const login = (userData) => {
        localStorage.setItem("jwtToken", userData.token)
        dispatch({
            type: 'LOGIN',
            payload: userData
        })
    }

    const logout = (callBack) => {
        localStorage.removeItem("jwtToken");
        callBack("home");
        dispatch({
            type: 'LOGOUT'
        })
    }

    return (
        <AuthContext.Provider
            value={{ user: state.user, login, logout}}
            {...props}
            />
    )
}

export { AuthContext, AuthProvider }