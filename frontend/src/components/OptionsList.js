import { useDispatch, useSelector } from "react-redux";
import { setUserWant } from "../store/slices/userWant";

export default function OptionsList() {
    const dispatch = useDispatch()

    const userGet = useSelector(state => state.userWant.checkedOptions)

    const handleChange = (field) => {
        dispatch(setUserWant(field))
    };
    return <ul className='text-teal-100'>
        What do you want to get?
        <li> <input type="checkbox" className='mr-2' checked={userGet.pdf} onChange={() => handleChange('pdf')} />Pdf file</li>
        <li> <input type="checkbox" className='mr-2' checked={userGet.xml} onChange={() => handleChange('xml')} />Exel file</li>
        <li> <input type="checkbox" className='mr-2' checked={userGet.table} onChange={() => handleChange('table')} />I want to see table here</li>
    </ul>



}
