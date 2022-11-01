export default function ButtonMain({text,onClick}) {
  return <button type="button" onClick={onClick} className="bg-teal-200 rounded-3xl text-xl hover:bg-teal-700 duration-500 
  ease-in py-4 px-10 text-green-800 hover:text-white hover:shadow-lg hover:shadow-teal-200">
   {text}
  </button>
}