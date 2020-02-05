import React from "react"
import Member from "./components/Member"
import { filterMembers } from "./helpers"

export const appReducer = (state, action) => {
  switch (action.type) {
    case "ORG_REQUEST_SUCCESS":
      const members = action.payload.map(m => (
        <Member key={m.login} login={m.login} avatar_url={m.avatar_url} />
      ))  
      return {
        ...state,
        loading: false,
        members,
        currentlyShowing: members
      }

    case "ORG_REQUEST_FAILED":
      return {
        ...state,
        loading: false,
        error: action.error,
      }

    case "INPUT_CHANGE":
      return {
        ...state,
        filterTerm: action.payload,
      }

    case "FILTER_MEMBER":
      return {
        ...state,
        currentlyShowing: filterMembers(state.filterTerm, state.members) 
      }

    default:
      return state
  }
}

export const memberReducer = (state, action) => {
  switch (action.type) {
    case "MEMBER_REQUEST_SUCCESS":
      return {
        ...state,
        loading: false,
        memberInfo: action.payload,
      }

    case "MEMBER_REQUEST_FAILED":
      return {
        ...state,
        loading: false,
        error: action.error,
      }

    case "MEMBER_CLICKED":
      return {
        ...state,
        isClicked: !state.isClicked,
      }

    default:
      return state
  }
}
