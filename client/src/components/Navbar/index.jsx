const Navbar = () => {

    return (
        <section className="fixed bg-white shadow-md w-full p-8 flex justify-between items-center">
            <span className="text-xl font-semibold text-black tracking-wider">Image generator</span>
            <div className="flex justify-evenly gap-x-8">
                <p className="text-md text-gray-500 font-normal hover:cursor-pointer hover:underline hover:decoration-gray-500 transition delay-300">Try</p>
                <p className="text-md text-gray-500 font-normal hover:cursor-pointer hover:underline hover:decoration-gray-500 transition delay-300">Docs</p>
            </div>
        </section>
    )

}
export default Navbar;