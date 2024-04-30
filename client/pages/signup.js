import { useState } from 'react'
import axios from 'axios'
const Signup = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmit = async (event) => {
        event.preventDefault();
        await axios.post("/api/users/signup", { email, password })
        console.log(email, password)
    }

    return (
        <div className="flex w-full justify-center h-full absolute bg-gray-200">
            <div className="w-full max-w-xs m-auto">
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
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" >
                        Sign In
                    </button>
                </form>
            </div >
        </div>
    )
};

export default Signup;
