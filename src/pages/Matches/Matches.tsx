import Header from "../../layouts/partials/Header";


interface CountryStats {
  id: number;
  country: string;
  users: number;
  matches: number;
}

const Matches = () => {
     const countryStats: CountryStats[] = [
    { id: 1, country: "United States", users: 1200, matches: 800 },
    { id: 2, country: "India", users: 950, matches: 700 },
    { id: 3, country: "Pakistan", users: 870, matches: 620 },
    { id: 4, country: "United Kingdom", users: 750, matches: 500 },
    { id: 5, country: "Canada", users: 640, matches: 420 },
    { id: 6, country: "Australia", users: 520, matches: 350 },
    { id: 7, country: "Germany", users: 480, matches: 300 },
    { id: 8, country: "France", users: 460, matches: 290 },
    { id: 9, country: "Brazil", users: 420, matches: 260 },
    { id: 10, country: "UAE", users: 400, matches: 250 },
  ];
  return (
    <div>
      <Header header={"Manage Users"} link='' />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
             
           <div className="my-3">
          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
            <table className="w-full text-sm text-left text-gray-600 rounded-lg overflow-hidden shadow-sm">
                <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-100/80 backdrop-blur-sm">
                 <tr>
              <th className="px-6 py-3">Country</th>
              <th className="px-6 py-3">Users</th>
              <th className="px-6 py-3">Matches</th>
            </tr>
                </thead>
                  <tbody className="divide-y divide-gray-200/60">
                   {countryStats.map((stat) => (
              <tr key={stat.id} className="bg-white hover:bg-gray-50">
                <td className="px-6 py-3 font-medium text-gray-800">
                  {stat.country}
                </td>
                <td className="px-6 py-3">{stat.users}</td>
                <td className="px-6 py-3">{stat.matches}</td>
              </tr>
            ))}
                  </tbody>
           </table>
           </div>
           </div>
               </div>
    </div>
  )
}

export default Matches
