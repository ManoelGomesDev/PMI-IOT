import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import Modal from "../components/Modal";
import { format } from "date-fns";

export default function Rdo() {
  const [equipament, setEquipament] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [rdos, setRdos] = useState([]);

  const date = format(new Date(), "dd/MM/yyyy");

  useEffect(() => {
    const refRdo = database.ref("rdos");

    refRdo.on("value", (result) => {
      const resultRdo = Object.entries(result.val() ?? {}).map(
        ([chave, valor]) => {
          return {
            chave: chave,
            equipament: valor.equipament,
            description: valor.description,
            user: valor.user,
            date: valor.date,
          };
        }
      );
      setRdos(resultRdo);
    });
  }, []);

  function handleShowForm() {
    return setShowModal(true);
  }

  function saveRdo(event) {
    event.preventDefault();

    const refRdo = database.ref("rdos");

    const data = {
      equipament,
      description,
      user,
      date,
    };

    refRdo.push(data);
    setEquipament("");
    setDescription("");
    setUser("");
    setShowModal(false);
  }

  return (
    <>
      <div className="flex flex-col  h-screen ">
        <button
          onClick={handleShowForm}
          className=" bg-blue-700 text-white rounded w-36 h-14 mb-6 "
        >
          Criar novo RDO
        </button>

        <table className="table-auto border-collapse border-2">
          <thead className="border-2">
            <tr className="border-2">
              <th className="border-2 border-black px-2">Data</th>
              <th className="border-2 border-black px-2">Equipamento</th>
              <th className="border-2 border-black px-2">Supervisor</th>
              <th className="border-2 px-2 border-black">
                Descrição da manutenção
              </th>
            </tr>
          </thead>
          <tbody className="border-2">
            {rdos.map((rdo) => {
              return (
                <div key={rdo.id}>
                       <tr >
                    <td className="px-2">{rdo.date}</td>
                    <td className="border-2 px-2">{rdo.equipament}</td>
                    <td className="border-2 px-2">{rdo.user}</td>
                    <td className="border-2 px-2">{rdo.description}</td>
                  </tr>

                </div>
               
                
              );
            })}
          </tbody>
        </table>
      </div>
      <Modal isVisible={showModal}>
        <form
          className="w-full max-w-xl flex flex-col rounded py-4 px-4 bg-white "
          onSubmit={saveRdo}
        >
          <input
            className=" mb-4 py-3 px-3 border"
            value={equipament}
            type="text"
            placeholder="Equipamento"
            onChange={(e) => setEquipament(e.target.value)}
          ></input>
          <input
            className=" mb-4 py-3 px-3 border"
            value={user}
            type="text"
            placeholder="Usuário"
            onChange={(e) => setUser(e.target.value)}
          ></input>

          <textarea
            className="h-64 border py-3 px-3 mb-4"
            value={description}
            type="text"
            placeholder="Descrição da manutenção"
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="px-4 py-4 bg-blue-700 text-white" type="submit">
            Salvar
          </button>
        </form>
      </Modal>
    </>
  );
}
