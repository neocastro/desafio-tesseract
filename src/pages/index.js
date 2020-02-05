import React, { useReducer, useEffect, useState } from "react"
import Member from "../components/Member"
import { appReducer } from "../reducers"
import { filterMembers } from "../helpers"

const App = () => {

    const [state, dispatch] = useReducer(appReducer, {
        error: '',
        members: [],
        loading: true 
    })

    const [text, setText] = useState('')

    const [filterResults, setFilterResults] = useState([])

    useEffect(() => {

        const controller = new AbortController()

        fetch('https://api.github.com/orgs/grupotesseract/public_members', {
            headers: new Headers({
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `Basic ${new Buffer(process.env.USERNAME + ":" + process.env.GITHUB_TOKEN).toString('base64')}`
            })
        })
        .then(response => response.json())
        .then(payload => dispatch({ type: 'REQUEST_SUCCESS', payload }))
        .catch(error => dispatch({ type: 'REQUEST_FAILED', error }))

        return () => controller.abort()

    }, [])


    useEffect(() =>  {
        setFilterResults(filterMembers(text, state.members))
        dispatch({ type: 'FILTER_MEMBERS', payload: text })
    }, [text])

    const handleInputChange = ev => {
        ev.preventDefault()
        setText(ev.target.value)
        // dispatch({ type: 'FILTER_MEMBERS', payload: ev.target.value })
    }

    return (
        <div 
            className="App"
            style={{
                display: "flex",
                flexDirection: "column",
                width: "60%",
                margin: "auto",
                justifyContent: "center"
            }} 
        > 

            <input 
                className="search-box"
                type="text"
                placeholder="Filtrar membros"
                value={text}
                onChange={handleInputChange}
            />

            <div className="members-list" />
                {
                    state.loading
                        ? <h3>Carregando informações da organização...</h3>
                        : filterResults.map(
                               m => <Member key={m.login} login={m.login} avatar_url={m.avatar_url} />
                            ) 
                }

        </div>
    )
}


export default App