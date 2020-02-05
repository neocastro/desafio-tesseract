import React, { useReducer, useEffect } from "react"
import { memberReducer } from "../reducers"

const Member = ({ login, avatar_url }) => {

    const [state, dispatch] = useReducer(memberReducer, {
        login,
        avatar_url,
        isClicked: false,
        loading: true
    })

    useEffect(() => {
        
        const controller = new AbortController()

        fetch(`https://api.github.com/users/${login}`, {
            headers: new Headers({
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `Basic ${new Buffer(process.env.USERNAME + ":" + process.env.GITHUB_TOKEN).toString('base64')}`
            })
        })
        .then(response => response.json())
        .then(({ name, public_repos, followers, created_at }) => {
            console.log(state.members)
            dispatch({
                type: 'REQUEST_SUCCESS',
                payload: { name, public_repos, followers, created_at }
            })
        })
        .catch(error => dispatch({ type: 'REQUEST_FAILED', error }))

        return () => controller.abort()

    }, [state.login])

    const handleClick = ev => {
        ev.preventDefault()
        dispatch({ type: 'MEMBER_CLICKED' })
    }


    return (
        <div 
            className="member"
            onClick={handleClick}
            key={state.login}
            onKeyDown={handleClick}
            key={state.login}  
            role="button"
            tabIndex={0}
        >
            {
                state.loading
                    ? <h4>Carregando informações do membro...</h4>
                    : (
                        <div className="member-card">

                            <img src={state.avatar_url}></img>


                            <h4>
                                <b>{state.login}</b>
                            </h4>

                            {
                                state.isClicked
                                    ? (
                                        <div className="member-extra-info"> 
                                            <ul>
                                                <li>Nome: {state.memberInfo.name}</li>
                                                <li>Repositórios: {state.memberInfo.public_repos}</li>
                                                <li>Seguidores: {state.memberInfo.followers}</li>
                                                <li>Criado em: {state.memberInfo.created_at}</li>
                                            </ul>
                                        </div>
                                    )

                                    : null 
                            }

                        </div>
                    )
            }
        </div>
    )

}


export default Member