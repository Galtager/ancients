import axios from "axios";
import { useState } from "react";
import ErrorsList from "../components/ErrorsList";

export default ({ url, method, body }) => {
    const [errors, setErrors] = useState(null)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)

    const doRequest = async (props = {}) => {
        try {
            setErrors(null);
            setLoading(true);
            setData(null)

            const response = await axios[method](url,
                { ...body, ...props }
            );
            setData(response.data);
            return response.data;
        } catch (err) {
            setErrors(<ErrorsList errors={err.response.data.errors} />)
            throw err;
        } finally {
            setLoading(false);

        }
    }
    return { doRequest, errors, loading, data }
}
