import { filterMembers } from "./helpers" 

export const appReducer = (state, action) => {
    switch (action.type) {

        case 'REQUEST_SUCCESS':
            return { ...state, loading: false, members: action.payload  }
        
        case 'REQUEST_FAILED':
            return { ...state, loading: false, error: action.error }
            
        case 'FILTER_MEMBER': 
            return { ...state, members: filterMembers(action.payload, state.members) }    

        default:
            return state
    }
}

export const memberReducer = (state, action) => {
    switch (action.type) {
        
        case 'REQUEST_SUCCESS':
            return { ...state, loading: false, memberInfo: action.payload }
        
        case 'REQUEST_FAILED':
            return { ...state, loading: false, memberInfo: {}, error: action.error }
    
        case 'MEMBER_CLICKED':
            return { ...state, isClicked: !state.isClicked }

        default:
            return state
    }
}