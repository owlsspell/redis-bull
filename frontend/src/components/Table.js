import { useSelector } from "react-redux"
import fields from "../constants/fields";


export default function Table() {

  const tableData = useSelector(state => state.tableData.tableData)


  let chosenColumns = tableData.chosenColumns ? tableData.chosenColumns.split(',') : []

  return (
    <>
      {tableData.data && tableData.data.length > 0 && tableData.chosenColumns ?
        <div className="bg-teal-500 w-full pb-20">
          <div className="overflow-x-auto relative container mx-auto">
            <table className="table-auto text-sm text-left text-gray-500 dark:text-gray-400 w-full m-auto">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {fields.map((item) => {
                    if (chosenColumns.includes(item.value)) {
                      return (
                        <th key={item.value} scope="col" className="py-3 px-6">
                          {item.name}
                        </th>
                      )
                    }
                  })}
                </tr>
              </thead>
              <tbody>

                {tableData.data.map(columns => {
                  return <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={columns._id}>

                    {fields.map((item) => {

                      if (chosenColumns.includes(item.value)) {

                        return (
                          <td key={columns._id + "_" + columns[item.value]} className="py-4 px-6">
                            {columns[item.value]}
                          </td>
                        )
                      }
                    })}

                  </tr>
                })}
              </tbody>
            </table>
          </div>
        </div> : ""
      }
    </>
  )
}