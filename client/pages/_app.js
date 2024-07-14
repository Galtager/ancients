
import 'tailwindcss/tailwind.css';
import backendClient from '../api/backend';
import Header from '../components/Header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser} />
            <div className='container'>
                <Component {...pageProps, currentUser} />
            </div>
        </div>
    )
}
AppComponent.getInitialProps = async appContext => {

    const client = backendClient(appContext.ctx);
    let pageProps = {}
    try {
        const { data } = await client.get('/api/users/currentuser');

        if (appContext.Component.getInitialProps) {
            pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser)
        }
        return { pageProps, ...data };

    } catch (error) {
        return { pageProps };
    }
}

export default AppComponent;