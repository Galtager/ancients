import backendClient from "../api/backend";


const LandingPage = ({ currentUser }) => {
  return <h1>{currentUser ? "You are sign in" : "You are NOT sign in"}</h1>;
};

LandingPage.getInitialProps = async (context) => {
  try {
    const client = backendClient(context)
    const { data } = await client.get("/api/users/currentuser")
    return data

  } catch (error) {
    return {};

  }

}

export default LandingPage;
