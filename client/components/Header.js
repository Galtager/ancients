import Link from 'next/link';

const Header = ({ currentUser }) => {

    const links = [
        { label: 'Sign Up', href: '/auth/signup', visible: !currentUser },
        { label: 'Sign In', href: '/auth/signin', visible: !currentUser },
        { label: 'Sign Out', href: '/auth/signout', visible: !!currentUser }
    ].filter(link => link.visible).map(link =>
        <li key={link.href} className='px-3'>
            <Link href={link.href} className="block py-2  text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                {link.label}
            </Link>
        </li>
    )
    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
            <div className=" flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/" className="flex self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                    <img src="https://flowbite.com/docs/images/logo.svg" alt="Flowbite Logo" className="me-1 h-8" />
                    Brand Name
                </Link>
                <div className=" w-full md:block md:w-auto" id="navbar-dropdown">
                    <ul className="flex">
                        {links}
                    </ul>
                </div>
            </div>
        </nav>)

}
export default Header;