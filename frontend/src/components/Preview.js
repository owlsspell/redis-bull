import Fields from "./Fields";

export default function Preview() {
  return (
    <div>
      <div className="mx-auto flex flex-wrap">
        <div className="w-full md:w-1/2 p-16">
          <h1 className="font text-4xl font-bold tracking-tight sm:text-6xl text-teal-50">
            You can chose <p className="underline decoration-teal-200">columns</p> here
          </h1>
          <p className="mt-4 text-xl text-teal-100">
            This columns will be on the result table
          </p>
        </div>
        <div className="w-full md:w-1/2 flex items-center">
          <Fields />
        </div>
      </div>
    </div>
  )
}
