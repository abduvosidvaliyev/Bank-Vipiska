import { useEffect, useState } from "react"
import { IoArrowBackSharp } from "react-icons/io5"
import { useNavigate, useParams } from "react-router-dom"
import { MOCK_STATEMENTS, PURCHASE_TYPES, MOCK_COUNTERPARTIES, type Statement, type StatementItem, type EntryType } from "../../mock/MockData"
import { FiPlus, FiTrendingUp, FiTrash2 } from "react-icons/fi"
import { FaArrowTrendDown } from "react-icons/fa6"
import { useForm, useFieldArray } from "react-hook-form"

interface ItemFormValues {
  date: string
  purchase_type: {
    id: number
    name: string
  }
  comment: string
  items: StatementItem[]
}

const FormPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [currentData, setCurrentData] = useState<Statement>()

  const { register, control, watch, reset, setValue, handleSubmit } = useForm<ItemFormValues>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      purchase_type: { id: 0, name: "" },
      comment: "",
      items: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  })

  const watchedItems = watch("items")

  useEffect(() => {
    if (id) {
      const cur = MOCK_STATEMENTS.find(s => s.id === Number(id))
      if (cur) {
        setCurrentData(cur)
        reset({
          date: cur.date ? cur.date.split("T")[0] : "",
          purchase_type: cur.purchase_type,
          comment: cur.comment,
          items: cur.items
        })
      }
    }
  }, [id, reset])

  // Yangi qator qo'shish
  const addNewRow = () => {
    append({
      id: Date.now(),
      counterparty: { id: 0, name: "" },
      contract: null,
      entry_type: "in" as EntryType,
      amount: "0",
      comment: ""
    })
  }

  // Jami kirim / chiqim hisoblash
  const totalIn = watchedItems
    ?.filter(item => item.entry_type === "in")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0) ?? 0

  const totalOut = watchedItems
    ?.filter(item => item.entry_type === "out")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0) ?? 0

  // Counterparty o'zgarganda name ni ham yangilash
  const handleCounterpartyChange = (index: number, counterpartyId: number) => {
    const found = MOCK_COUNTERPARTIES.find(c => c.id === counterpartyId)
    if (found) {
      setValue(`items.${index}.counterparty.name`, found.name)
    }
  }


  const SubmitData = (data: ItemFormValues) => {
    const finalData: Statement = {
      ...data,
      id: currentData?.id || Date.now(),
      number: currentData?.number || `00${Math.floor(Math.random() * 1000)}`,
      is_approved: currentData?.is_approved || false,
      status: currentData?.status || "draft",
      total_in: totalIn.toString(),
      total_out: totalOut.toString(),
      created_at: currentData?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      employee_name: currentData?.employee_name || "Hozirgi Foydalanuvchi",
    }

    if (id) {
      // Tahrirlash (Edit)
      const index = MOCK_STATEMENTS.findIndex(s => s.id === Number(id));
      if (index !== -1) {
        MOCK_STATEMENTS[index] = finalData;
      }

      /* 
      // === SERVER FUNKSIYASI ORQALI TAHRIRLASH ===
      // Import: import { updateBankStatement } from "../../server/document";
      try {
        await updateBankStatement(id, finalData);
      } catch (error) {
        console.error("Saqlashda xato:", error);
      }
      */

    } else {
      // Yangi yaratish (Create)
      MOCK_STATEMENTS.push(finalData);

      /*
      // === SERVER FUNKSIYASI ORQALI YANGI QO'SHISH ===
      // Import: import { createBankStatement } from "../../server/document";
      try {
        await createBankStatement(finalData);
      } catch (error) {
        console.error("Yaratishda xato:", error);
      }
      */
    }

    navigate(-1);
  }

  return (
    <div className="flex flex-col items-start gap-5 px-[200px] py-[50px]">
      <button
        className="flex items-center gap-1 text-gray-500 hover:text-black hover:bg-gray-200 py-3 px-4 rounded-lg"
        onClick={() => navigate(-1)}
      >
        <IoArrowBackSharp /> Qaytish
      </button>

      <h1 className="text-2xl font-semibold">
        {id ? "Vipiskani tahrirlash - " + currentData?.number : "Yangi vipiska yaratish"}
      </h1>

      <div className="flex flex-col gap-4 w-full bg-white rounded-xl p-6 border">
        <span className="text-xl font-semibold">
          Asosiy ma'lumotlar
        </span>

        <div className="grid grid-cols-3 gap-5">
          {/* Sana */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Sana</label>
            <input
              type="date"
              {...register("date")}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 bg-white"
            />
          </div>

          {/* Turi */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Turi</label>
            <select
              {...register("purchase_type.id", { valueAsNumber: true })}
              onChange={(e) => {
                register("purchase_type.id").onChange(e)
                const selected = PURCHASE_TYPES.find(pt => pt.id === Number(e.target.value))
                if (selected) {
                  setValue("purchase_type.name", selected.name)
                }
              }}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 bg-white appearance-none"
            >
              <option value={0}>Tanlang...</option>
              {PURCHASE_TYPES.map(pt => (
                <option key={pt.id} value={pt.id}>{pt.name}</option>
              ))}
            </select>
            <input type="hidden" {...register("purchase_type.name")} />
          </div>

          {/* Izoh */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">Izoh</label>
            <textarea
              {...register("comment")}
              placeholder="Qo'shimcha izoh..."
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 bg-white resize-y min-h-[80px]"
            />
          </div>
        </div>
      </div>

      {/* Elementlar - react-hook-form useFieldArray */}
      <div className="flex flex-col gap-4 w-full bg-white rounded-xl p-6 border">
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold">
            Elementlar
          </span>
          <button
            type="button"
            onClick={addNewRow}
            className="flex items-center gap-1 text-sm bg-slate-100 px-3 py-2 rounded-md border hover:bg-slate-200"
          >
            <FiPlus />
            Qator qo'shish
          </button>
        </div>

        {fields.length > 0 ? (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2 px-2 font-medium w-[30px]">#</th>
                <th className="py-2 px-2 font-medium">Kontragent</th>
                <th className="py-2 px-2 font-medium">Shartnoma №</th>
                <th className="py-2 px-2 font-medium">Turi</th>
                <th className="py-2 px-2 font-medium">Summa</th>
                <th className="py-2 px-2 font-medium">Izoh</th>
                <th className="py-2 px-2 font-medium w-[40px]"></th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => {
                return (
                  <tr key={field.id} className="border-b last:border-b-0 hover:bg-slate-50">
                    <td className="py-2 px-2 text-gray-400">{index + 1}</td>

                    {/* Kontragent */}
                    <td className="py-2 px-2">
                      <select
                        {...register(`items.${index}.counterparty.id`, { valueAsNumber: true })}
                        onChange={(e) => {
                          register(`items.${index}.counterparty.id`).onChange(e)
                          handleCounterpartyChange(index, Number(e.target.value))
                        }}
                        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-blue-500 bg-white w-full"
                      >
                        <option value={0}>Tanlang...</option>
                        {MOCK_COUNTERPARTIES.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      <input type="hidden" {...register(`items.${index}.counterparty.name`)} />
                    </td>

                    {/* Shartnoma */}
                    <td className="py-2 px-2">
                      <input
                        {...register(`items.${index}.contract.number`)}
                        placeholder="CON-..."
                        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-blue-500 bg-white w-full" />
                    </td>

                    {/* Kirim / Chiqim */}
                    <td className="py-2 px-2">
                      <select
                        {...register(`items.${index}.entry_type`)}
                        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-blue-500 bg-white w-full"
                      >
                        <option value="in">Kirim</option>
                        <option value="out">Chiqim</option>
                      </select>
                    </td>

                    {/* Summa */}
                    <td className="py-2 px-2">
                      <input
                        {...register(`items.${index}.amount`)}
                        type="number"
                        placeholder="0"
                        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-blue-500 bg-white w-full" />
                    </td>

                    {/* Izoh */}
                    <td className="py-2 px-2">
                      <input
                        {...register(`items.${index}.comment`)}
                        placeholder="Izoh..."
                        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-blue-500 bg-white w-full" />
                    </td>

                    {/* O'chirish */}
                    <td className="py-2 px-2">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-400 py-8 border border-dashed rounded-lg">
            Elementlar yo'q. "Qator qo'shish" tugmasini bosing.
          </div>
        )}
      </div>

      <div className="w-full flex justify-between items-center">
        <div className="flex gap-5 items-center">
          <div className="flex items-center bg-white py-2 px-4 border">
            <FiTrendingUp className="text-green-600 text-lg" />
            <h4 className="flex flex-col ml-2">
              <small className="text-slate-600">
                Jami kirim
              </small>
              <code className="text-green-600 text-lg">
                {totalIn.toLocaleString()} so'm
              </code>
            </h4>
          </div>
          <div className="flex items-center bg-white py-2 px-4 border">
            <FaArrowTrendDown className="text-red-600 text-lg" />
            <h4 className="flex flex-col ml-2">
              <small className="text-slate-600">
                Jami chiqim
              </small>
              <code className="text-red-600 text-lg">
                {totalOut.toLocaleString()} so'm
              </code>
            </h4>
          </div>
        </div>

        <div className="flex gap-5 items-center">
          <button
            className="border py-2 px-3 bg-slate-100 hover:bg-slate-200 transition rounded-md"
          >
            Bekor qilish
          </button>
          <button
            className="border py-2 px-3 bg-[#2160c4] text-white hover:bg-[#2160c9d4] transition rounded-md"
            onClick={handleSubmit(SubmitData)}
          >
            {id ? "Saqlash" : "Yaratish"}
          </button>
        </div>
      </div>

    </div>
  )
}

export default FormPage