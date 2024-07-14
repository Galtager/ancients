import { Router } from "next/router";
import useRequest from "../../hooks/use-request"
import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout';

const OrderShow = ({ currentUser, order }) => {

    const [timeLeft, setTimeLeft] = useState(0)

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(msLeft / 1000)
        }

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => { clearInterval(timerId) }
    }, [])


    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'POST',
        body: { orederId: order.id }
    });

    const createPayment = async (token) => {
        try {
            const payment = await doRequest({ token });
            Router.push("/orders")
        } catch (error) {
            console.log(error)
        }
    }
    if (timeLeft < 0) {
        return (<div>Order expired</div>)
    }
    return (
        <div>
            <h1>Time left to pay: {timeLeft} seconds</h1>
            {errors}
            <StripeCheckout token={(token) => { createPayment(token) }}
                stripeKey="pk_test_51PbLj8AsCVq2zhGeHaig5mIqh6OOcxz8CJeF1MYxbk4lrXc4gVBxPIDsxkkFRChPLQ24ENdxuuZMlIvaEfvsVINM007Fo4HSnm"
                amount={order.ancient.price * 100}
                email={currentUser.email}
            />
            <button className="btn btn-primary" onClick={createOrder}>Pay</button>
        </div>

    )
}
OrderShow.getInitialProps = async (context, client, currentUser) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`)
    return { order: data };
}

export default OrderShow