import { useState } from "react";

const Footer = () => {
    const [year,] = useState(new Date().getFullYear())
    return (
        <section className="bg-white border-t-2 border-gray-200 w-full fixed bottom-0 flex justify-center p-6">
            <p className="text-lg text-gray-500 font-normal">&copy;{year}</p>
        </section>
    )

}
export default Footer;