import { Router } from "next/router";
import useRequest from "../../hooks/use-request"

const AncientShow = ({ currentUser, ancient }) => {

    const { doRequest, errors } = useRequest({
        url: '/api/orders',
        method: 'POST',
        body: { ancientId: ancient.id }
    });

    const createOrder = async () => {
        try {
            const order = await doRequest();
            Router.push('/orders/[orderId]', `/orders/${order.id}`)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <h1>{ancient.title}</h1>
            <h4>{ancient.price}</h4>
            {errors}
            <button className="btn btn-primary" onClick={createOrder}>Purchase</button>
        </div>

    )
}
AncientShow.getInitialProps = async (context, client, currentUser) => {
    const { ancientId } = context.query;
    const { data } = await client.get(`/api/ancients/${ancientId}`)
    return { ancient: data };
}

export default AncientShow