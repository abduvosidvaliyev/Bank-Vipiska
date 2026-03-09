import { FiPlus } from "react-icons/fi"
import { useState } from "react"
import { MOCK_STATEMENTS, type StatementStatus } from "../mock/MockData"
import { FaRegTrashAlt } from "react-icons/fa"
import { LuPencil } from "react-icons/lu"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
  const navigate = useNavigate()
  const [statements, setStatements] = useState(MOCK_STATEMENTS)

  const statusBadge = (status: StatementStatus) => {
    if (status === "draft") {
      return (
        <span className="px-3 py-1 rounded-2xl bg-gray-300">
          Qoralama
        </span>
      )
    } else if (status === "approved") {
      return (
        <span className="px-3 py-1 rounded-2xl bg-green-500 text-white">
          Tastiqlangan
        </span>
      )
    }
    return (
      <span className="px-3 py-1 rounded-2xl bg-red-500 text-white">
        Bekor qilindi
      </span>
    )
  }

  const removeData = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()

    if (window.confirm("Rostdan ham ushbu ma'lumotni o'chirmoqchimisiz?")) {
      const index = MOCK_STATEMENTS.findIndex(st => st.id === id);
      if (index !== -1) {
        MOCK_STATEMENTS.splice(index, 1);

        /*
          IMPORT: import { deleteBankStatement } from "../server/document"
          try {
            await deleteBankStatement(id)
          } catch (error) {
            console.error("O'chirishda xato:", error)
          }
        */
      }

      setStatements(prev => prev.filter(st => st.id !== id));

    }
  }

  return (
    <div className="px-[130px] py-10">
      <div className="flex justify-between items-center">
        <h3 className="flex flex-col text-2xl font-bold">
          Bank Hisoboti
          <small className="text-sm font-normal">
            Barcha bank vipiskalarini boshqaring
          </small>
        </h3>
        <button
          className="bg-[#2160c4] py-[10px] px-4 rounded-lg text-white flex items-center gap-2"
          onClick={() => navigate("/create")}
        >
          <FiPlus />
          Yangi hisobot
        </button>
      </div>

      <div className="mt-10 bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="text-[#737b8c] text-[14px] ">
            <tr>
              <th className="text-start font-medium px-3 py-3">Raqam</th>
              <th className="text-start font-medium">Sanasi</th>
              <th className="text-start font-medium">Xodim</th>
              <th className="text-end font-medium">Jami kirim</th>
              <th className="text-end font-medium">Jami chiqim</th>
              <th className="text-end font-medium">Status</th>
              <th className="text-end font-medium px-3">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {statements.length !== 0 ? (
              statements.map(st => (
                <tr
                  key={st.id}
                  className="hover:bg-gray-100"
                  onClick={() => navigate(`/edit/${st.id}`)}
                >
                  <td className="text-start py-5 px-3">{st.number}</td>
                  <td className="text-start">
                    {st.date ? st.date.split("T")[0].split("-").reverse().join(".") : ""}
                  </td>
                  <td className="text-start">{st.employee_name}</td>
                  <td className="text-end font-mono text-green-600">
                    +{Number(st.total_in).toLocaleString("uz-UZ")} so'm
                  </td>
                  <td className="text-end font-mono text-red-600">
                    -{Number(st.total_out).toLocaleString("uz-UZ")} so'm
                  </td>
                  <td className="text-end text-xs font-medium">{statusBadge(st.status)}</td>
                  <td className="text-end py-5 px-3 flex justify-end items-center gap-2">
                    <span
                      className="hover:bg-gray-200 p-2 cursor-pointer rounded-sm"
                    >
                      <LuPencil />
                    </span>
                    <span
                      className="hover:bg-gray-200 p-2 cursor-pointer rounded-sm text-red-600"
                      onClick={(e) => removeData(e, st.id)}
                    >
                      <FaRegTrashAlt />
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>
                  Ma' lumot topilmadi!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard