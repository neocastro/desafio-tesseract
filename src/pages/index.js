import React, { useReducer, useEffect, useState } from "react"
import Member from "../components/Member"
import { appReducer } from "../reducers"

const App = () => {

    const [state, dispatch] = useReducer(appReducer, {
        error: '',
        members: [],
        loading: true 
    })

    const [text, setText] = useState('')

    const [filterResults, setFilterResults] = useState(state.members)

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

    }, [state.members])


    useEffect(() => {
        setFilterResults(
            state.members.filter(
                m => m.login.toLowerCase().includes(text.toLowerCase())
            )
        )
    }, [text])

    const handleInputChange = ev => {
        ev.preventDefault()
        setText(ev.target.value)
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
                        ? 'Carregando...'
                        : filterResults.map(
                            m => <Member key={m.login} login={m.login} avatar_url={m.avatar_url} />
                        ) || state.members 
                }

        </div>
    )
}


export default App