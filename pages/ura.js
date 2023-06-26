import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import Modal from "../components/Modal";
import styles from '../styles/home.module.css'

export default function Dashboard() {
  const [mcpOn, setMcpOn] = useState();

  const mcp = database.ref("mcpOn");

  const [temperatureIn, setTemperatureIn] = useState();
  const [temperatureOut, setTemperatureOut] = useState(0);
  const [temperatureConfigURA, setTemperatureConfigURA] = useState(6);

  const [rpm, setRpm] = useState(0);
  const [ledOn, setLedOn] = useState();

  const [temperatureOutConfig, setTemperatureOutConfig] = useState(6);
  const [pressureConfig, setPressureConfig] = useState(0);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);

  const rangeTempInAndOut = temperatureIn - temperatureOut;
  const yieldTemp60percent = 10;
  const yieldTemp40percent = 5;
  const led = database.ref("ledOn");

  useEffect(() => {
    const refTemp1 = database.ref("temp1");

    refTemp1.on("value", (snapshot) => {
      setTemperatureIn(Math.round(snapshot.val()));
    });

    return () => {
      refTemp1.off("value");
    };
  }, [temperatureIn]);
  useEffect(() => {
    const refTemp2 = database.ref("temp2");

    refTemp2.on("value", (snapshot) => {
      setTemperatureOut(Math.round(snapshot.val()));
    });

    return () => {
      refTemp2.off("value");
    };
  }, [temperatureOut]);


  useEffect(() => {
    const refTemperaturesConfigURA = database.ref("tempConfigURA");

    refTemperaturesConfigURA.on("value", (snapshot) => {
      setTemperatureConfigURA(Math.round(snapshot.val()));
    });

    return () => {
      refTemperaturesConfigURA.off("value");
    };
  }, [temperatureConfigURA]);

  useEffect(() => {
    mcp.on("value", (snapshot) => {
      setMcpOn(snapshot.val());
    });

    if (temperatureOut < temperatureOutConfig) {
      mcp.set(false);
      setShowModal3(true);
    }
    if (temperatureOut > temperatureOutConfig) {
      setShowModal3(false);
      setShowModal1(false)
      
    }
    if (!showModal1) {
      if (rangeTempInAndOut < yieldTemp60percent) {
        setShowModal2(true)
        setTimeout(() => {
            setShowModal2(false)
        }, 1000)
      } 
    }
    if (rangeTempInAndOut < yieldTemp40percent) {
        mcp.set(false);
        setLedOn(true);
        led.set(true);
        setShowModal1(true);
        setShowModal2(false)
      } else {
        setLedOn(false);
        led.set(false);
      }

 
  }, [
    temperatureOut,
    temperatureOutConfig,
    mcp,
    rangeTempInAndOut,
    yieldTemp40percent,
    yieldTemp60percent,
    showModal1,
    led
  ]);

  const aumentarValor = () => {
    const novoValor = temperatureConfigURA + 1;
    const databaseRef = database.ref('tempConfigURA');
    databaseRef.set(novoValor)
      .then(() => {
        console.log('Valor atualizado com sucesso!');
      })
      .catch((error) => {
        console.error('Erro ao atualizar o valor:', error);
      })
    }
    const diminuirValor = () => {
      const novoValor = temperatureConfigURA - 1;
      const databaseRef = database.ref('tempConfigURA');
      databaseRef.set(novoValor)
        .then(() => {
          console.log('Valor atualizado com sucesso!');
        })
        .catch((error) => {
          console.error('Erro ao atualizar o valor:', error);
        })
      }



  function setPlusPressureConfig() {
    setPressureConfig(pressureConfig + 1);
  }

  function setMinusPressureConfig() {
    setPressureConfig(pressureConfig - 1);
  }

  function handleBtn() {
    setShowModal2(false);
  }

  function handleOnMcp() {
    mcp.set(true);
  }

  function handleOffMcp() {
    mcp.set(false);
  }

  return (
    <div className="grid lg:grid-cols-1 h-screen mx-10">
      <div className="mt-10"> 
        <div className={styles.header }>
        
          <p className="text-gray-700 text-3xl mb-10 font-bold">
            Parâmetros da URA
          </p>
          <div className={styles.headerBtn}>
          <button
            className={`w-40 py-4 rounded ${
              mcpOn ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
            }`}
            disabled={!mcpOn}
            onClick={handleOffMcp}
          >
            Desligar URA
          </button>
          <button
            className={`w-40 py-4 rounded ${
              mcpOn ? "bg-gray-200 text-black" : "bg-blue-600 text-white"
            }`}
            disabled={mcpOn}
            onClick={handleOnMcp}
          >
            Ligar URA
          </button>

          </div>

        </div>

        <div className="grid lg:grid-cols-3 gap-5 mb-16">
          <div
            className={`rounded bg-white h-40 shadow-sm flex items-center justify-around border-4 border-blue-500`}
          >
            <picture className="flex flex-col items-center justify-center">
              <img className="w-26 h-auto" src="/termometre.png" alt="mcp" />
            </picture>
            <div className="flex flex-col">
              <p className="text-xl mb-3 text-center">
                Temperatura da Água de entrada
              </p>
              <p className="text-center font-bold text-lg">
                {temperatureIn} ºC
              </p>
            </div>
          </div>
          <div
            className={`rounded bg-white h-40 shadow-sm flex items-center justify-around border-4 ${
              showModal2 ? "border-red-500" : "border-blue-500"
            }`}
          >
            <picture className="flex flex-col items-center justify-center">
              <img className="w-26 h-auto" src="/termometre.png" alt="mcp" />
            </picture>
            <div className="flex flex-col">
              <p className="text-xl mb-3 text-center">
                Temperatura da Água/Saída
              </p>
              <p className="text-center font-bold text-lg">
                {temperatureOut} ºC
              </p>
            </div>
          </div>
          <div
            className={`rounded bg-white h-40 shadow-sm flex items-center justify-around border-4 ${
              showModal1 | showModal2 ? "border-red-500" : "border-blue-500"
            }`}
          >
            <picture className="flex flex-col items-center justify-center">
              <img className="w-26 h-auto" src="/termometre.png" alt="mcp" />
            </picture>
            <div className="flex flex-col">
              <p className="text-xl mb-3 text-center">
                Variação da Temperatura
              </p>
              <p className="text-center font-bold text-lg">
                {rangeTempInAndOut} ºC
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="text-gray-700 text-3xl mb-10 font-bold">SetPoints</p>

        <div className="grid lg:grid-cols-3 gap-5 mb-16">
          <div className="rounded bg-white h-40 shadow-sm flex items-center justify-around ">
            <picture className="flex flex-col items-center justify-center">
              <img className="w-26 h-auto" src="/termometre.png" alt="mcp" />
            </picture>
            <div className="flex flex-col items-center">
              <p className="text-xl mb-3 text-center">
                Temperatura mínima da Água/Saída
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={diminuirValor}
                  disabled={temperatureConfigURA <= 0}
                >
                  <MinusIcon className="h-5 w-5" />
                </button>

                <p className="text-center font-bold text-lg">
                  {temperatureConfigURA} ºC
                </p>
                <button onClick={aumentarValor}>
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isVisible={showModal1}>
        <h3 className="text-center font-bold text-red-500 text-3xl">
          ALERTA - Temperatura fora dos Parâmetros
        </h3>
        <p className="text-center font-bold text-2xl">{`Range de temperatura em ${rangeTempInAndOut} ºC, URA desligada por motivo de segurança, verificar a temperatura. Quando for restabelecida a temperatura dentro dos padroes de trabalho, será permitido religar a URA`}</p>
      </Modal>
      <Modal isVisible={showModal2}>
        <h3 className="text-center font-bold text-red-500 text-3xl">
          ALERTA - Rendimento de Temperatura fora dos Parâmetros
        </h3>
        <p className="text-center font-bold text-2xl">{`Range de temperatura em ${rangeTempInAndOut} ºC, rendimento abaixo do previsto`}</p>
        
      </Modal>
      <Modal isVisible={showModal3}>
        <h3 className="text-center font-bold text-red-500 text-3xl">
          ALERTA - Temperatura da água de saída abaixo dos parâmetros estabelecidos.
        </h3>
        <p className="text-center font-bold text-2xl">{`Temperatura em ${temperatureOut} ºC, abaixo do setpoint`}</p>
       
      </Modal>
    </div>
  );
}
