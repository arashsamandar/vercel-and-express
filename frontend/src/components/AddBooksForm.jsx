import * as React from "react";
import '/src/assets/css/getBooksFormStyles.css';

export default function AddBooksForm() {

    function submitFormFunction() {
        alert('hello arash solomon');
    }

    return (
            <form method="POST" onSubmit={submitFormFunction} className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-center text-white">Contact Us</h2><br/>

                <div className="space-y-2">
                    <label htmlFor="name" className="labelsClasses">Name</label>
                    <input
                        type="text"
                        name="name"
                        className="textBoxesClasses"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="labelsClasses">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="textBoxesClasses"
                        required
                    />
                </div>
                <br/>

                <div className="flex justify-between space-x-10">

                    <button
                        type="button"
                        className="buttonsClasses"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="buttonsClasses"
                    >
                        Submit
                    </button>

                </div>

            </form>
    );
}