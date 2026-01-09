import Navbar from '../components/navbar/navbar'

const Layout = ({ children }) => {
    return (
        <div className='bg-gray-100 min-h-screen'>
            <Navbar />
            <div className="p-6 px-10">
                {children}
            </div>
        </div>
    )
}

export default Layout;