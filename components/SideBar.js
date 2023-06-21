import { forwardRef } from "react";
import Link from "next/link";
import { HomeIcon, Cog6ToothIcon, ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

const SideBar = forwardRef(({ showNav }, ref) => {
  const router = useRouter();

  return (
    <div ref={ref} className="fixed w-56 h-full bg-white shadow-sm">
      <div className="flex justify-center mt-6 mb-14">
        <picture>
          <img
            className="w-32 h-auto"
            src="/logoImage.png"
            alt="company logo"
          />
        </picture>
      </div>

      <div className="flex flex-col">
       <p className="text-center text-gray-600 mb-6">Equipamentos</p>
        <Link href="/">
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
              router.pathname == "/"
              ? "bg-blue-100 text-blue-500"
              : "text-gray-400 hover:bg-blue-100 hover:text-blue-500"
            }`}
          >
            <div className="mr-2">
              <Cog6ToothIcon className="h-5 w-5" />
            </div>
            <div>
              <p>MCP</p>
            </div>
          </div>
        </Link>
        <Link href="/ura">
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
              router.pathname == "/ura"
              ? "bg-blue-100 text-blue-500"
              : "text-gray-400 hover:bg-blue-100 hover:text-blue-500"
            }`}
          >
            <div className="mr-2">
              <Cog6ToothIcon className="h-5 w-5" />
            </div>
            <div>
              <p>URA</p>
            </div>
          </div>
        </Link>
        <p className="text-center text-gray-600 mb-6">Arquivos</p>

        <Link href="/rdo">
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
              router.pathname == "/rdo"
                ? "bg-blue-100 text-blue-500"
                : "text-gray-400 hover:bg-blue-100 hover:text-blue-500"
            }`}
          >
            <div className="mr-2">
              <ClipboardDocumentIcon className="h-5 w-5" />
            </div>
            <div>
              <p>RDO</p>
            </div>
          </div>
        </Link>
        <Link href="/arquivos">
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
              router.pathname == "/arquivos"
                ? "bg-blue-100 text-blue-500"
                : "text-gray-400 hover:bg-blue-100 hover:text-blue-500"
            }`}
          >
            <div className="mr-2">
              <ClipboardDocumentIcon className="h-5 w-5" />
            </div>
            <div>
              <p>ARQUIVOS</p>
            </div>
          </div>
        </Link>
        
      </div>
    </div>
  );
});

SideBar.displayName = "SideBar";

export default SideBar;
