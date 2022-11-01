import { useSelector } from "react-redux"

export default function ResultQuery() {
  // const chosenColumns = useSelector(state => state.chosenColumns.columns)
  const chosenFilters = useSelector(state => state.chosenColumns.filter)
  // console.log('chosenFilters', chosenFilters);
  // console.log('chosenColumns', chosenColumns);
  return (<div>
    <div className="flex items-baseline">
      {chosenFilters.length>0 ?
      <h4 className="text-white text-2xl font-bold mt-10 mr-5 ">You chose fields:  </h4>
      :""}
      {/* <span className="text-white text-xl font-bold mt-10 italic">
        {chosenColumns.map((column, index) => {
        return <p key={column.name}> {column.name + (index === chosenColumns.length - 1 ? "": ", ")}</p>
      })}</span> */}

    </div>
    {chosenFilters.length > 0 &&
      <div className="flex items-baseline">
        <div className="flex items-baseline w-full">
          <span className="text-white text-2xl font-bold mt-10 mr-5">Filter: </span>
          <span className="flex text-white text-xl font-bold mt-10 italic">
            {chosenFilters.map((field, index) => {
              console.log('field', field);
              return <div className="px-2 flex items-center" key={field.selectedColumn.value + "_" + field.selectedValue}>{field.selectedColumn.name}  <Arrow /> {field.selectedValue} {(index === chosenFilters.length - 1 ? "" : ", ")}</div>
            })}</span></div>
      </div>}
  </div >
  )
}

const Arrow = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
</svg>
