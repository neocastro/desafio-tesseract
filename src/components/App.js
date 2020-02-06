import React, { useReducer, useEffect, useMemo } from "react"
import Member from "./Member"
import { appReducer } from "../reducers"

const appInitialState = {
  error: "",
  members: [],
  filterTerm: "",
  currentlyShowing: [],
  loading: true,
}

const App = ({ orgName }) => {
  const [state, dispatch] = useReducer(appReducer, appInitialState)

  useEffect(() => {
    const controller = new AbortController()

    fetch(`https://api.github.com/orgs/${orgName}/public_members`)
      .then(response => response.json())
      .then(payload => dispatch({ type: "ORG_REQUEST_SUCCESS", payload }))
      .catch(error => dispatch({ type: "ORG_REQUEST_FAILED", error }))

    return () => controller.abort()
  }, [orgName])

  const handleInputChange = ev => {
    ev.preventDefault()
    dispatch({ type: "INPUT_CHANGE", payload: ev.target.value })
    dispatch({ type: "FILTER_MEMBER", payload: ev.target.value })
  }

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "60%",
        margin: "auto",
        justifyContent: "center",
      }}
    >
      <input
        className="search-box"
        type="text"
        placeholder="Filtrar membros"
        value={state.filterTerm}
        onChange={handleInputChange}
      />

      <div className="members-list" />
      { 
        state.loading 
          ? <h3>Carregando informações da organização...</h3>
          : state.currentlyShowing
      }
    </div>
  )
}

export default App
