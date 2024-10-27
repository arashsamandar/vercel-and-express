import * as React from "react";
import '/src/assets/css/getBooksFormStyles.css';

export default function AddBooksForm() {

    const [inputIsValid, setInputIsValid] = React.useState({
        name: true,
        email: true,
        password: true,
        password_confirmation: true,
    });
    const [userData, setUserData] = React.useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    function submitFormFunction(e) {
        alert('hello arash solomon');
        e.preventDefault();
    }
    const onFieldChange = (e) => {
        const {name, value} = e.target;
        setUserData((prevState)=>({...prevState, [name]: value}));
        setInputIsValid((prevState) => ({...prevState, [name]: (value.length >= 5)}));
        console.log(name + ' : ' + value);
    }

    return (
        <form method="POST" onSubmit={submitFormFunction} className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-xl">

            <h2 className="text-3xl font-bold text-center text-white">Contact Us</h2><br/>

            <div className="space-y-2">
                <label htmlFor="name" className="labelsClasses">Name</label>
                <input type="text" name="name" value={userData.name} onChange={onFieldChange} className={`textBoxesClasses ${inputIsValid.name ? 'border border-gray-600' : 'border border-red-500'}`} required/>
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="labelsClasses">Email</label>
                <input type="email" name="email" value={userData.email} onChange={onFieldChange} className={`textBoxesClasses ${inputIsValid.email ? 'border border-gray-600' : 'border border-red-500'}`} required/>
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="labelsClasses">Password</label>
                <div className="flex space-x-4">
                    <input type="password" name="password" value={userData.password} onChange={onFieldChange} className={`textBoxesClasses ${inputIsValid.password ? 'border border-gray-600' : 'border border-red-500'}`} required/>
                    <input type="password" name="password_confirmation" value={userData.password_confirmation} onChange={onFieldChange} className={`textBoxesClasses ${inputIsValid.password_confirmation ? 'border border-gray-600' : 'border border-red-500'}`} required/>
                </div>
            </div>
            <br/>
            <div className="flex justify-between space-x-10">
                <button type="button" className="buttonsClasses">
                    Cancel
                </button>
                <button type="submit" className="buttonsClasses">
                    Submit
                </button>
            </div>

        </form>
    );
}