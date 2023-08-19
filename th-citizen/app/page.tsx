
export default function Home()  {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold underline">
        Thai Citizen Token ID Card
      </h1>
      <a href='/claim'>Claim</a>
      <a href='/view'>View </a>
      <a href='/viewCitizen'>View Citizen by third party</a>
      
    </main>
  )
}
