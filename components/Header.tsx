import Link from 'next/link'

const Header = () => {
  return (
    <header className="bg-yellow-400">
      <div className="mx-auto flex max-w-7xl justify-between p-5">
        <div>
          <Link href="/">
            <img
              src="/svg/logo.svg"
              className="h-[25px] w-[161px] cursor-pointer pr-2"
            />
          </Link>
        </div>

        <div className="flex items-center space-x-8 text-gray-900">
          <div className="flex items-center space-x-5">
            <div className="hidden items-center space-x-5 md:inline-flex">
              <h3>About</h3>
              <h3>Contact</h3>
            </div>
          </div>
          <div className="flex items-center space-x-5">
            <a href="https://www.sanity.io" target="_blank">
              Sign In
            </a>
            <h3
              className="cursor-pointer rounded-full bg-gray-900 px-4 
              py-2 text-white transition duration-100 hover:bg-gray-800"
            >
              Get Started
            </h3>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
