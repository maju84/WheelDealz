import Listings from "./auctions/Listings";

async function getData() {
  const response = await fetch("http://localhost:6001/search");

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
}

export default async function Home() {
  const data = await getData();

  return (
    <div>
      <Listings />
      {JSON.stringify(data, null, 2)}
    </div>
  );
}
