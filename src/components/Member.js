import React, { useReducer, useEffect } from "react"


const memberReducer = (state, action) => {
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
                'Authorization': `Basic ${new Buffer(process.env.USERNAME + ":" + process.env.GITHUB_TOKEN)}`
            })
        })
        .then(response => response.json())
        .then(({ name, public_repos, followers, created_at }) => dispatch({
            type: 'REQUEST_SUCCESS',
            payload: { name, public_repos, followers, created_at }
        }))
        .catch(error => dispatch({ type: 'REQUEST_FAILED', error }))

        return () => controller.abort()

    }, [login])

    const handleClick = ev => {
        ev.preventDefault()
        dispatch({ type: 'MEMBER_CLICKED' })
    }


    return (
        <div 
            className="member"
            onClick={handleClick}
            key={state.login}

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
                            }

                        </div>
                    )
            }
        </div>
    )

}


export default Member