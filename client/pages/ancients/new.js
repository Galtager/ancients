import { useState } from "react";
import useRequest from "../../hooks/use-request";
import { Router } from "next/router";

const NewAncient = ({ currentUser }) => {
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const { doRequest, errors } = useRequest({ url: '/api/ancients', method: 'POST', body: { price, title } });

    const onBlur = (e) => {
        const value = parseFloat(price);
        if (isNaN()) {
            return
        }
        setPrice(value.toFixed(2))
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await doRequest();
            Router.push("/")
        } catch (error) {
            console.log(error)
        }
    }
    return <div>
        <h1>Create an Ancient</h1>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
                <label>Price</label>
                <input onBlur={onBlur} value={price} onChange={(e) => setPrice(e.target.value)} className="form-control" />
            </div>
            {errors}
            <button className="btn btn-primary">Submit</button>
        </form>
    </div>
};

NewAncient.getInitialProps = async (context, client, currentUser) => {
    return {};
}

export default NewAncient;
