import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import Modal from "../components/Modal";
import { format } from "date-fns";

export default function Rdo() {
  const [equipament, setEquipament] = useState("");
  const [description, setDescription] = useState("");
  const [local, setLocal] = useState("");
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
            local: valor.local,
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
  function handleHideForm() {
    return setShowModal(false);
  }

  function saveRdo(event) {
    event.preventDefault();

    const refRdo = database.ref("rdos");

    const data = {
      equipament,
      description,
      local,
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
      <div className="mx-10 flex flex-col  h-screen">
        <div className="flex justify-between items-center my-6">
          <p className="text-gray-700 text-3xl mb-10 font-bold">
            Relatório de Obras Diário
          </p>
          <button
            onClick={handleShowForm}
            className=" bg-blue-700 text-white rounded w-36 h-14"
          >
            Criar novo RDO
          </button>
        </div>

        <div className="overflow-x-auto mx-5">
          <table className="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Equipamento</th>
                <th>local</th>
                <th>Supervisor</th>
                <th>Descrição da manutenção</th>
              </tr>
            </thead>
            <tbody className="border-2">
              {rdos.map((rdo) => {
                return (
                  <tr key={rdo.id}>
                    <td className="px-2">{rdo.date}</td>
                    <td className="border-2 px-2">{rdo.equipament}</td>
                    <td className="border-2 px-2">{rdo.local}</td>
                    <td className="border-2 px-2">{rdo.user}</td>
                    <td className="border-2 px-2">{rdo.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isVisible={showModal} className="rounded-md">
        <form
          className="w-full  flex flex-col rounded py-4 px-4 bg-white gap-3 "
          onSubmit={saveRdo}
        >
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Equipamento</span>
            </label>
            <input
              type="text"
              placeholder="Nome do equipamento"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => setEquipament(e.target.value)}
              value={equipament}
            />
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Local</span>
            </label>
            <input
              type="text"
              placeholder="Local do serviço"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => setLocal(e.target.value)}
              value={local}
            />
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Supervisor</span>
            </label>
            <input
              type="text"
              placeholder="Nome do supervisor"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) => setUser(e.target.value)}
              value={user}
            />
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Descrição do serviço</span>
            </label>
            <textarea
              placeholder="Descreva o serviço realizado"
              className="textarea textarea-bordered textarea-lg w-full max-w-xs"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-row-reverse gap-4 ">
            <button className="btn bg-blue-700 text-white" type="submit">
              Salvar
            </button>
            <button className="btn" onClick={handleHideForm}>Cancelar</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
