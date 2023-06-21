import { Fragment, useEffect, useState } from "react";
import { database } from "../services/firebase";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import Modal from "../components/Modal";

export default function Dashboard() {


  const [temperature, setTemperature] = useState()
  const [pressure, setPressure] = useState(5)
  const [rpm, setRpm] = useState(0)
  const [temperatureConfig, setTemperatureConfig] = useState(30)
  const [pressureConfig, setPressureConfig] = useState(6)
  const [showModal, setShowModal] = useState(false)


  const [mcpOn, setMcpOn] = useState()
  const [ledOn, setLedOn] = useState()

  const mcp = database.ref("mcpOn")
  const led = database.ref("ledOn")
 
  useEffect(() => {

    const refTemperatures = database.ref("temp1");
  

    refTemperatures.on("value", (snapshot) => {
      setTemperature(Math.round(snapshot.val()));
    });

    return () => {
      refTemperatures.off("value");
    };
  }, [temperature]);

  useEffect(() => {
    
    mcp.on('value', (snapshot) => {
      setMcpOn(snapshot.val())
    })


    if (temperature >= temperatureConfig) {
      mcp.set(false)
      setRpm(0)

      setShowModal(true)
      led.set(true)
      setLedOn(true)

    } else if (temperature <= temperatureConfig) {
      setShowModal(false)
      led.set(false)
      setLedOn(false)
    }
  }, [temperature, temperatureConfig, led, mcp])

  function handleOnMcp(){
    mcp.set(true)
    setRpm(1200)
  }
  function handleOffMcp(){
    mcp.set(false)
    setRpm(0)
  }

  function setPlusTemperatureConfig() {
    setTemperatureConfig(temperatureConfig + 1)
  }

  function setMinusTemperatureConfig() {
    setTemperatureConfig(temperatureConfig - 1)
  }


  function setPlusPressureConfig() {
    setPressureConfig(pressureConfig + 1)
  }

  function setMinusPressureConfig() {
    setPressureConfig(pressureConfig - 1)
  }



  return (
    <Fragment>
      
      <div className="grid lg:grid-cols-1">
        <div>

          <div className="flex items-center justify-between  mb-6">
            <p className="text-gray-700 text-3xl mb-10 font-bold">Parâmetros do MCP</p>
            <button className={`w-40 py-4 rounded ${ mcpOn ?   'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`} disabled={!mcpOn} onClick={handleOffMcp}>
              
              Desligar MCP
            
          </button>
            <button className={`w-40 py-4 rounded ${ mcpOn ? 'bg-gray-200 text-black' : 'bg-blue-600 text-white'}`} disabled={mcpOn} onClick={handleOnMcp}>
              
              Ligar MCP
            
          </button>

        

          </div>
          <div className="grid lg:grid-cols-3 gap-5 mb-16">
            <div className={`rounded bg-white h-40 shadow-sm flex items-center justify-around border-4 ${temperature > temperatureConfig ? 'border-red-500' : 'border-blue-500'}`}>

              <picture className="flex flex-col items-center justify-center">
                <img
                  className="w-20 h-auto"
                  src="/termometre.png"
                  alt="mcp"
                />

              </picture>
              <div className="flex flex-col">
                <p className="text-xl mb-3">Temperatura do óleo</p>
                <p className="text-center font-bold text-lg">{temperature} ºC</p>

              </div>


            </div>

            <div className={`rounded bg-white h-40 shadow-sm flex items-center justify-around border-4 ${pressure > pressureConfig ? 'border-red-500' : 'border-blue-500'}`}>

              <picture className="flex flex-col items-center justify-center">
                <img
                  className="w-20 h-auto"
                  src="/pressure.png"
                  alt="mcp"
                />

              </picture>
              <div className="flex flex-col">
                <p className="text-xl mb-3">Pressão do óleo</p>
                <p className="text-center font-bold text-lg">{pressure} Psi</p>

              </div>


            </div>

            <div className={`rounded bg-white h-40 shadow-sm flex items-center justify-around`}>

              <picture className="flex flex-col items-center justify-center">
                <img
                  className="w-20 h-auto"
                  src="/dinamo.png"
                  alt="mcp"
                />

              </picture>
              <div className="flex flex-col">
                <p className="text-xl mb-3">Rotação do Motor</p>
                <p className="text-center font-bold text-lg">{rpm} RPM</p>

              </div>


            </div>

          </div>
        </div>
        <div>
          <p className="text-gray-700 text-3xl mb-10 font-bold">SetPoints</p>

          <div className="grid lg:grid-cols-3 gap-5 mb-16">
            <div className="rounded bg-white h-40 shadow-sm flex items-center justify-around border-4">

              <picture className="flex flex-col items-center justify-center">
                <img
                  className="w-20 h-auto"
                  src="/termometre.png"
                  alt="mcp"
                />

              </picture>
              <div className="flex flex-col items-center">
                <p className="text-xl mb-3">Temperatura do óleo</p>
                <div className="flex space-x-4">
                  <button onClick={setMinusTemperatureConfig} disabled={temperatureConfig <= 0}>
                    <MinusIcon className="h-5 w-5" />
                  </button>

                  <p className="text-center font-bold text-lg">{temperatureConfig} ºC</p>
                  <button onClick={setPlusTemperatureConfig} >
                    <PlusIcon className="h-5 w-5" />
                  </button>


                </div>

              </div>
            </div>
            <div className="rounded bg-white h-40 shadow-sm flex items-center justify-around border-4">

              <picture className="flex flex-col items-center justify-center">
                <img
                  className="w-20 h-auto"
                  src="/pressure.png"
                  alt="mcp"
                />

              </picture>
              <div className="flex flex-col items-center">
                <p className="text-xl mb-3">Pressão do óleo</p>
                <div className="flex space-x-4">
                  <button onClick={setMinusPressureConfig} disabled={pressureConfig <= 0}>
                    <MinusIcon className="h-5 w-5" />
                  </button>

                  <p className="text-center font-bold text-lg">{pressureConfig} PSI</p>
                  <button onClick={setPlusPressureConfig} >
                    <PlusIcon className="h-5 w-5" />
                  </button>


                </div>

              </div>
            </div>
          </div>
        </div >
      </div>
      <Modal isVisible={showModal} >
        <h3 className="text-center font-bold text-red-500 text-3xl">ALERTA - Temperatura fora dos Parâmetros</h3>
        <p className="text-center font-bold text-2xl">{`Temperatura do óleo do MCP em ${temperature} ºC, MCP desligado por motivo de segurança, verificar a temperatura. Quando for restabelecida a temperatura dentro dos padroes de trabalho, será permitido religar o MCP`}</p>

      </Modal>
    </Fragment>
  );
}
