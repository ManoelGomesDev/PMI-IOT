import { useEffect, useState } from "react"
import { database, storage } from "../services/firebase"
import Modal from "../components/Modal"
import { format } from 'date-fns';
import FileUpload from "../components/FileUpload";






export default function Arquivos() {




 
  

    const [equipament, setEquipament] = useState('')
    const [ship, setShip] = useState('')
   

    const [showModal, setShowModal] = useState(false)
    const [documents, setDocuments] = useState([])

    const date = format(new Date(), 'dd/MM/yyyy');

    useEffect(() => {
        const refDocuments = database.ref('documents')

        refDocuments.on('value', result => {
            const resultDocuments = Object.entries(result.val() ?? {}).map(([chave, valor]) => {
                return {
                    'chave': chave,
                    'equipament': valor.equipament,
                    'ship': valor.ship,
                    
                    'date': valor.date

                }
            })
            setDocuments(resultDocuments)
        })
    }, [])

   




    function handleShowForm() {
        return setShowModal(true)
    }



    function saveDocuments(event) {
        event.preventDefault()

        const refDocuments = database.ref('documents')

        const data = {
            equipament,
            ship,
         
            date
        }

        refDocuments.push(data)
        setEquipament('')
        setShip('')
        setShowModal(false)

    }

    return (
        <>
        <div className="flex space-x-96 pt-3">
        <p className="text-gray-700 text-3xl mb-10 font-bold">Cadastrar equipamento para impressão 3D</p>
         <button onClick={handleShowForm} className=" bg-blue-700 text-white rounded w-36 h-14 mb-6 ">
            Salvar novo documento</button>
        </div>
        
            <div className="flex flex-col  h-screen ">

               



                <table className="table-auto border-collapse border-2">
                    <thead className="border-2">
                        <tr className="border-2">
                            <th className="border-2 border-black px-2">Data</th>
                            <th className="border-2 border-black px-2">Equipamento</th>
                            <th className="border-2 border-black px-2">Navio</th>
                            <th className="border-2 px-2 border-black">Projeto</th>
                        </tr>
                    </thead>
                    <tbody className="border-2">
                        {documents.map(rdo => {
                            return (
                                <>
                                      <tr>
                                    <td className="px-2">{rdo.date}</td>
                                    <td className="border-2 px-2">{rdo.equipament}</td>
                                    <td className="border-2 px-2">{rdo.ship}</td>
                                    <td className="border-2 px-2">{rdo.project}</td>
                                </tr>
                                </>
                          
                            )

                        })}
                    </tbody>
                </table>




            </div>
            <Modal isVisible={showModal}>
                <form className="w-full max-w-xl flex flex-col rounded py-4 px-4 bg-white " onSubmit={saveDocuments}>
                    <input className=" mb-4 py-3 px-3 border" value={equipament} type="text" placeholder="Equipamento" onChange={e => setEquipament(e.target.value)}></input>
                    <input className=" mb-4 py-3 px-3 border" value={ship} type="text" placeholder="Navio" onChange={e => setShip(e.target.value)}></input>


                    <div>
                       <FileUpload />
                    </div>
                    <button className="px-4 py-4 bg-blue-700 text-white" type="submit">Salvar</button>

                </form>
            </Modal>
        </>
    )
}