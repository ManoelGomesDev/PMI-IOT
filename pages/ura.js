import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import Modal from "../components/Modal";






export default function Dashboard() {

    const [mcpOn, setMcpOn] = useState()

    const mcp = database.ref("mcpOn")

    const [temperatureIn, setTemperatureIn] = useState()
    const [temperatureOut, setTemperatureOut] = useState(0)

    const [rpm, setRpm] = useState(0)

    const [temperatureOutConfig, setTemperatureOutConfig] = useState(6)
    const [pressureConfig, setPressureConfig] = useState(0)
    const [showModal1, setShowModal1] = useState(false)
    const [showModal2, setShowModal2] = useState(false)

    const rangeTempInAndOut = temperatureIn - temperatureOut;
    const yieldTemp60percent = temperatureIn * 0.6;
    const yieldTemp40percent = temperatureIn * 0.4;

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

        mcp.on('value', (snapshot) => {
            setMcpOn(snapshot.val())
        })

        if (temperatureOut < temperatureOutConfig) {
            mcp.set(false)
            setShowModal1(true)
        }
        if (temperatureOut > temperatureOutConfig) {
            setShowModal1(false)
        }

        if (rangeTempInAndOut < yieldTemp60percent) {
            mcp.set(false)
            setShowModal2(true)
        }
        if (yieldTemp40percent >= rangeTempInAndOut) {
            mcp.set(false)
            setShowModal1(true)
        }

    }, [temperatureOut, temperatureOutConfig, mcp, rangeTempInAndOut, yieldTemp40percent, yieldTemp60percent])



    function setPlusTemperatureOutConfig() {
        setTemperatureOutConfig(temperatureOutConfig + 1)
    }

    function setMinusTemperatureOutConfig() {
        setTemperatureOutConfig(temperatureOutConfig - 1)
    }


    function setPlusPressureConfig() {
        setPressureConfig(pressureConfig + 1)
    }

    function setMinusPressureConfig() {
        setPressureConfig(pressureConfig - 1)
    }

    function handleBtn() {
        setShowModal2(false)
    }

    function handleOnMcp(){
        mcp.set(true)
      }


    return (

        <div className="grid lg:grid-cols-1">
           <div>
            <div className="flex items-center justify-between  mb-6">
                <p className="text-gray-700 text-3xl mb-10 font-bold">Parâmetros da URA</p>
                <button className={`w-40 py-4 rounded ${mcpOn ? 'bg-gray-200 text-black' : 'bg-blue-600 text-white'}`} disabled={mcpOn} onClick={handleOnMcp}>

                    Ligar URA

                </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-5 mb-16">


                    <div className={`rounded bg-white h-40 shadow-sm flex items-center justify-around border-4 border-blue-500`}>

                        <picture className="flex flex-col items-center justify-center">
                            <img
                                className="w-26 h-auto"
                                src="/termometre.png"
                                alt="mcp"
                            />

                        </picture>
                        <div className="flex flex-col">
                            <p className="text-xl mb-3 text-center">Temperatura da Água de entrada</p>
                            <p className="text-center font-bold text-lg">{temperatureIn} ºC</p>

                        </div>


                    </div>
                    <div className={`rounded bg-white h-40 shadow-sm flex items-center justify-around border-4 ${showModal2 ? 'border-red-500' : 'border-blue-500'}`}>

                        <picture className="flex flex-col items-center justify-center">
                            <img
                                className="w-26 h-auto"
                                src="/termometre.png"
                                alt="mcp"
                            />

                        </picture>
                        <div className="flex flex-col">
                            <p className="text-xl mb-3 text-center">Temperatura da Água/Saída</p>
                            <p className="text-center font-bold text-lg">{temperatureOut} ºC</p>

                        </div>


                    </div>



                </div>
            </div>
            
            <div>
                <p className="text-gray-700 text-3xl mb-10 font-bold">SetPoints</p>

                <div className="grid lg:grid-cols-3 gap-5 mb-16">

                    <div className="rounded bg-white h-40 shadow-sm flex items-center justify-around ">

                        <picture className="flex flex-col items-center justify-center">
                            <img
                                className="w-26 h-auto"
                                src="/termometre.png"
                                alt="mcp"
                            />

                        </picture>
                        <div className="flex flex-col items-center">
                            <p className="text-xl mb-3 text-center">Temperatura mínima da Água/Saída</p>
                            <div className="flex space-x-4">
                                <button onClick={setMinusTemperatureOutConfig} disabled={temperatureOutConfig <= 0}>
                                    <MinusIcon className="h-5 w-5" />
                                </button>

                                <p className="text-center font-bold text-lg">{temperatureOutConfig} ºC</p>
                                <button onClick={setPlusTemperatureOutConfig} >
                                    <PlusIcon className="h-5 w-5" />
                                </button>


                            </div>

                        </div>
                    </div>

                </div>
            </div >
            <Modal isVisible={showModal1}>
                <h3 className="text-center font-bold text-red-500 text-3xl">ALERTA - Temperatura fora dos Parâmetros</h3>
                <p className="text-center font-bold text-2xl">{`Temperatura de agua gelada de saida em ${temperatureOut} ºC, URA desligada por motivo de segurança, verificar a temperatura. Quando for restabelecida a temperatura dentro dos padroes de trabalho, será permitido religar a URA`}</p>

            </Modal>
            <Modal isVisible={showModal2}>
                <h3 className="text-center font-bold text-red-500 text-3xl">
                    ALERTA - Rendimento de Temperatura fora dos Parâmetros
                </h3>
                <p className="text-center font-bold text-2xl">{`Temperatura de agua gelada de saída em ${temperatureOut} ºC, rendimento abaixo do previsto`}</p>
                <button onClick={handleBtn}>OK</button>

            </Modal>
        </div>

    );
}
