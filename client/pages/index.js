import backendClient from "../api/backend";


const LandingPage = ({ currentUser }) => {
  console.log(currentUser)
  return <h1>{currentUser ? "You are sign in" : "You are NOT sign in"}</h1>;
};

LandingPage.getInitialProps = async (context) => {
  const client = backendClient(context)
  const { data } = await client.get("/api/users/currentuser")
  return data
}

export default LandingPage;
