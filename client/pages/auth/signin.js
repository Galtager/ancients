import { useState } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request';
import LoadingButton from '../../components/ui/LoadingButton';
const Signin = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { doRequest, errors, loading } = useRequest({ url: "/api/users/signin", method: "post", body: { email, password } })

    const onSubmit = async (event) => {
        try {
            event.preventDefault();
            await doRequest();
            Router.push("/")

        } catch (error) {

        }
    }

    return (
        <div className="flex w-full justify-center h-full absolute bg-gray-200">
            <div className="w-full max-w-md m-auto">
                <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                            Email
                        </label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            placeholder="Email" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" >
                            Password
                        </label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline"
                            type='password'
                            id="password"
                            placeholder="***********" />
                    </div>
                    {errors}
                    <LoadingButton type="submit" loading={loading}>
                        Sign In
                    </LoadingButton>
                </form>
            </div >
        </div>
    )
};

export default Signin;
