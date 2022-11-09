import { useDispatch, useSelector } from "react-redux";
import { setUserWant } from "../store/slices/userWant";

export default function OptionsList() {
    const dispatch = useDispatch()

    const userGet = useSelector(state => state.userWant.checkedOptions)
    console.log('userGet,', userGet);
    const handleChange = (field) => {
        dispatch(setUserWant(field))
    };
    return <div className="flex justify-center	pt-8 space-x-6 ">
        <ul className='text-teal-100'>
            What do you want to get?
            <li> <input type="checkbox" className='mr-2' checked={userGet.pdf} onChange={() => handleChange('pdf')} />Pdf file</li>
            <li> <input type="checkbox" className='mr-2' checked={userGet.xml} onChange={() => handleChange('xml')} />Exel file</li>
            <li> <input type="checkbox" className='mr-2' checked={userGet.table} onChange={() => handleChange('table')} />I want to see table here</li>
        </ul>

        {/* <ButtonMain text="Download pdf" onClick={getPdf} />
    <ButtonMain text="Download XLS" onClick={getXml} /> */}
    </div>
}