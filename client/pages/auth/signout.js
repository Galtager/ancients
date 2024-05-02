import Router from "next/router"
import { useEffect } from "react"
import useRequest from "../../hooks/use-request"

const Signout = () => {
    const { doRequest } = useRequest({ url: "/api/users/signout", method: "post" })

    useEffect(() => {
        onSignout()
    }, [])
    const onSignout = async () => {
        try {
            await doRequest();
            Router.push('/')
        } catch (error) {
        }
    }
    return <div>Signing you out...</div>
}

export default Signout