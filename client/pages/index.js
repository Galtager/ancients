import Link from "next/link";

const LandingPage = ({ currentUser, ancients }) => {
  const ancientList = ancients.map(ancient => {
    return (
      <tr key={ancient.id}>
        <td>{ancient.title}</td>
        <td>{ancient.price}</td>
        <td>
          <Link href="/ancients/[ancientId]" as={`/ancients/${ancient.id}`}>
            View
          </Link></td>
      </tr>)
  })
  return (
    <div>
      <h1>Ancients</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {ancientList}
        </tbody>
      </table>
    </div>
  )

};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/ancients")
  return { ancients: data };
}

export default LandingPage;
