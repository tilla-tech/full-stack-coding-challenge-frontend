import { NextPage } from "next";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import Layout from "../components/layout";
import useApiData from "../hooks/use-api-data";
import Airport from "../types/airport";

const Page: NextPage = () => {
  const [query, setQuery] = useState<string>("");

  const airports = useApiData<Airport[]>(`/api/airports/${query}`, [], [query]);

  const [cluster, setCluster] = useState({
    start: 0,
    end: 40,
  });
  const listRef = useRef<HTMLElement>();

  useEffect(() => {
    const updateCluster = () => {
      const SWAP_SIZE = 20;

      if (
        listRef.current.firstElementChild.getBoundingClientRect().bottom > 0
      ) {
        const next = cluster.start < SWAP_SIZE ? cluster.start : SWAP_SIZE;
        if (next > 0) {
          setCluster((cur) => ({
            start: cur.start - next,
            end: cur.end - next,
          }));
        }
      }
      if (
        listRef.current.lastElementChild.getBoundingClientRect().top <
        window.innerHeight
      ) {
        const remaining = airports.length - cluster.end;
        const next = remaining > SWAP_SIZE ? SWAP_SIZE : remaining;
        if (next > 0) {
          setCluster((cur) => ({
            start: cur.start + next,
            end: cur.end + next,
          }));
        }
      }
    };
    document.addEventListener("scroll", updateCluster);

    return () => {
      document.removeEventListener("scroll", updateCluster);
    };
  }, [airports, cluster]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Code Challenge: Airports</h1>

      <div className="mt-10 relative shadow-sm">
        <input
          type="text"
          name="query"
          id="query"
          className="focus:ring-blue-600 focus:border-blue-600 block w-full sm:text-sm border-gray-300 text-gray-800 rounded bg-gray-50 p-3"
          placeholder="Start typing..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <h2 className="mt-10 text-xl font-semibold">
        Airports
        <span className="rounded-[1rem] ml-2 bg-blue-400 text-white text-xs py-1 px-2">
          {airports.length}
        </span>
      </h2>

      <div ref={listRef} className="grid sm:grid-cols-2 gap-5 mt-5">
        {airports.slice(cluster.start, cluster.end).map((airport) => (
          <Link
            className="flex flex-col justify-between gap-2 p-5 text-gray-800 border border-gray-200 rounded-lg shadow-sm hover:border-blue-600 focus:border-blue-600 focus:ring focus:ring-blue-200 focus:outline-none"
            href={`/airports/${airport.iata.toLowerCase()}`}
            key={airport.iata}
          >
            <span>
              {airport.name}, {airport.city}
            </span>
            <span className="text-gray-500">{airport.country}</span>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Page;
