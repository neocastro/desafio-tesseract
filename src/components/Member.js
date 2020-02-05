import React, { useReducer, useEffect } from "react"
import { memberReducer } from "../reducers"
import { formatDate } from "../helpers"

const memberInitialState = {
  isClicked: false,
  loading: true,
  memberInfo: {},
}

const Member = ({ login, avatar_url }) => {
  const [state, dispatch] = useReducer(
    memberReducer,
    memberInitialState,
    initState => ({
      login,
      avatar_url,
      ...initState,
    })
  )

  useEffect(() => {
    const controller = new AbortController()

    fetch(`https://api.github.com/users/${login}`, {
      headers: new Headers({
        Accept: "application/vnd.github.v3+json",
        Authorization: `Basic ${new Buffer(
          process.env.USERNAME + ":" + process.env.GITHUB_TOKEN
        ).toString("base64")}`,
      }),
    })
      .then(response => response.json())
      .then(({ name, public_repos, followers, created_at }) => {
        dispatch({
          type: "MEMBER_REQUEST_SUCCESS",
          payload: { name, public_repos, followers, created_at },
        })
      })
      .catch(error => dispatch({ type: "MEMBER_REQUEST_FAILED", error }))

    return () => controller.abort()
  }, [])

  const handleClick = ev => {
    ev.preventDefault()
    dispatch({ type: "MEMBER_CLICKED" })
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
      {state.loading ? (
        <h4>Carregando informações do membro...</h4>
      ) : (
        <div
          className="member-card"
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
            border: "solid",
            width: "auto",
          }}
        >
          <img
            src={state.avatar_url}
            alt="gitub-avatar"
            style={{ width: "50%" }}
          />

          <h4>
            <b>{state.login}</b>
          </h4>

          {state.isClicked ? (
            <div
              className="member-extra-info"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <ul>
                <li>Nome: {state.memberInfo.name}</li>
                <li>Repositórios: {state.memberInfo.public_repos}</li>
                <li>Seguidores: {state.memberInfo.followers}</li>
                <li>Criado em: {formatDate(state.memberInfo.created_at)}</li>
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default Member
