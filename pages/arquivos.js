import { useEffect, useState } from "react";
import { database, storage } from "../services/firebase";
import Modal from "../components/Modal";
import { format } from "date-fns";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import firebase from "firebase/compat/app";

export default function Arquivos({ file }) {
  const [equipament, setEquipament] = useState("");
  const [nameEquipament, setNameEquipament] = useState("");
  const [ship, setShip] = useState("");
  const [progress, setProgress] = useState(0);
  const [imgURL, setImgURL] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [documents, setDocuments] = useState([]);

  const date = format(new Date(), "dd/MM/yyyy");

  const formHandler = (e) => {
    e.preventDefault();
    const file = e.target[0]?.files[0];
    if (!file) return;

    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setImgURL(url);
        });
      }
    );
  };

  useEffect(() => {
    const refDocuments = database.ref("documents");

    refDocuments.on("value", (result) => {
      const resultDocuments = Object.entries(result.val() ?? {}).map(
        ([chave, valor]) => {
          return {
            chave: chave,
            equipament: valor.equipament,
            ship: valor.ship,
            imgURL: valor.imgURL,
            date: valor.date,
          };
        }
      );

      setDocuments(resultDocuments);
    });
  }, [imgURL]);

  function saveDocument() {
    const refDocuments = database.ref("documents");

    const data = {
      equipament,
      ship,
      imgURL,
      date,
    };

    refDocuments.push(data);
    setEquipament("");
    setShip("");
    setShowModal(false);
  }

  function handleShowForm() {
    return setImgURL("") & setShowModal(true);
  }

  function handleHideForm() {
    return setShowModal(false);
  }

  return (
    <>
      <div className="mx-10 flex flex-col  h-screen">
        <div className="flex justify-between items-center my-6">
          <p className="text-gray-700 text-3xl mb-10 font-bold">
            Cadastrar equipamento para impressão 3D
          </p>
          <input
            onChange={(e) => setNameEquipament(e.target.value)}
            value={nameEquipament}
          />
          <button
            onClick={handleShowForm}
            className="btn bg-blue-700 text-white"
          >
            Salvar novo documento
          </button>
        </div>

        <div className="overflow-x-auto mx-5">
          <table className="table mx-10">
            <thead>
              <tr>
                <th>Data</th>
                <th>Equipamento</th>
                <th>Navio</th>
                <th>Projeto</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((document) => {
                return (
                  <>
                    <tr>
                      <td>{document.date}</td>
                      <td>{document.equipament}</td>
                      <td>{document.ship}</td>
                      <td>
                        <a
                          href={document.imgURL}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ArrowDownTrayIcon className="h-5 w-5" />
                        </a>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isVisible={showModal}>
        <form
          className="w-full max-w-xl flex flex-col rounded py-4 px-4 bg-white "
          onSubmit={formHandler}
        >
          <div className="flex flex-col gap-5">
            <div>
              <input type="file" className="input" />
            </div>
            <button type="submit">Carregar</button>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Equipamento</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={equipament}
                placeholder="Equipamento"
                onChange={(e) => setEquipament(e.target.value)}
              />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Navio</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                value={ship}
                placeholder="Navio"
                onChange={(e) => setShip(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-row-reverse gap-3">
            <button
              className="btn bg-blue-700 text-white"
              onClick={saveDocument}
            >
              Salvar
            </button>
            <button className="btn" onClick={handleHideForm}>
              Cancelar
            </button>
          </div>
        </form>
        {!imgURL && <progress value={progress} max="100" />}
        {imgURL && <image src={imgURL} alt="Imagem" width="20" height="20" />}
      </Modal>
    </>
  );
}
