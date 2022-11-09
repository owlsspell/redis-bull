import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import fields from "../constants/fields";
import { addColumns, clearCheckedFields, setCheckedFields } from "../store/slices/chosenFields";

export default function Fields() {

  // first_name,last_name,email,gender,department,totalSum
  const dispatch = useDispatch()
  const checked = useSelector(state => state.chosenColumns.checkedFields)

  console.log('fields', fields);
  console.log('checkedFields', checked);

  // const addField = (name, value) => {
  //   if (!chosenColumns.some(item => item.value === value)) {
  //     // if (!chosenColumns.includes({name,value})) {
  //     dispatch(addColumns({ name, value }))
  //   }
  // }

  // // useMemo(() => {
  //   fields.forEach(field => {
  //     // field.value
  //     // console.log()
  //   });

  // }, [chosenColumns])

  // const [checked, setChecked] = useState({});
  // console.log('checked', checked);
  const handleChange = (field) => {
    dispatch(setCheckedFields(field))
    // setChecked({...checked, [field] : !checked[field] });

  };
  // useEffect(() => {
  //   fields.forEach((field) => {
  //     // setChecked({ ...checked, ...(checked[field.value] = false) })
  //     // dispatch(setCheckedFields(field))
  //   })
  // }, [])

  function addField() {
    for (let key in checked) {
      if (checked[key]) {
        fields.filter((field) => field.value === key && dispatch(addColumns(field)))
      }
    }
    // fields.forEach((field) => {
    //   setChecked({ ...checked, ...(checked[field.value] = false) })
    // })
    // dispatch(clearCheckedFields())
  }



  return (
    <div>
      {/* <div class="grid grid-col-4 grid-flow-col gap-4 my-14"> */}
      <div className="grid grid-cols-2 md:grid-cols-[1fr_auto_1fr]  gap-y-8 gap-x-6">
        {fields.map(field => {

          return <button onClick={() => handleChange(field.value)
            // addField(field.name, field.value)
          } key={field.value}
            className={"w-full rounded-2xl py-2 px-4 text-white text-xl font-bold hover:scale-110 duration-200 ease-in " + (checked[field.value] ? "bg-teal-700 scale-110" : "bg-teal-600")}>
            {field.name}
            <input type="checkbox"
              checked={checked[field.value]}
              className="hidden"
              value={field.name}
              onChange={() => { }}
            />
          </button>
        }
        )}

        {/* <button  onClick={() => addField()}>On</button> */}


      </div>


    </div>)
}