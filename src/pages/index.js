import React, { useReducer, useEffect, useState } from "react"
import Member from "../components/Member"


const appReducer = (state, action) => {
    switch (action.type) {
        
        case 'REQUEST_SUCCESS':
            return { ...state, loading: false, members: action.payload  }
        
        case 'REQUEST_FAILED':
            return { ...state, loading: false, error: action.error }
            
        default:
            return state
    }
}


const App = () => {

    const [state, dispatch] = useReducer(appReducer, {
        loading: true,
        error: '',
        members: []
    })

    const [text, setText] = useState('')

    const [filterResults, setFilterResults] = useState(state.members)

    useEffect(() => {
        
        const controller = new AbortController()

        fetch('https://api.github.com/orgs/grupotesseract/public_members', {
            headers: new Headers({
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
        <div className="App"> 

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
                        ? state.members
                        : filterResults.map(
                            m => <Member key={m.login} login={m.login} avatar_url={m.avatar_url} />
                        )
                }

        </div>
    )
}


export default App