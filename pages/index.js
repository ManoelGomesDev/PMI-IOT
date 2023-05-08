import { useEffect, useState } from "react";
import { database } from "../services/firebase";



export default function Home() {


  const [temperature, setTemperature] = useState(20)

  useEffect(() => {
  
    const refTemperatures = database.ref("temperatures");

    refTemperatures.on("value", (snapshot) => {
      setTemperature(Math.round(snapshot.val()));
    });

    return () => {
      refTemperatures.off("value");
    };
  }, [temperature]);





  return (
    <>
      <p className="text-gray-700 text-3xl mb-16 font-bold">Dashboard</p>

      <div className="grid lg:grid-cols-3 gap-5 mb-16">


        <div className={`rounded bg-white h-40 shadow-sm flex items-center justify-around border-4
        ${temperature >= 14 ?
            "border-blue-500" :
            "border-red-500"
          }
      `}>
          <picture className="flex flex-col items-center justify-center">
            <img
              className="w-20 h-auto"
              src="/termometre.png"
              alt="company logo"
            />
            <p className="text-xl">Temperatura</p>
          </picture>
          <span className={`text-xl ${temperature >= 14 ? "text-blue-700" : "text-red-700"}`}>{temperature} ºC</span>
        </div>
      </div>

    </>
  );
}
