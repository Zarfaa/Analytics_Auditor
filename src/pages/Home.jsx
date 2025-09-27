import { FaSignOutAlt } from "react-icons/fa";

function Home({ user, onLogout }) {
  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <div className="w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">


        <div className=" p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between relative">
          <div className="flex items-center space-x-4">

            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={user.displayName || "User"}
                className="w-16 h-16 rounded-full shadow-md object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary-dark flex items-center justify-center text-white font-bold text-2xl shadow-md">
                {user.displayName ? user.displayName[0] : "U"}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-primary-dark">Welcome back,</h1>
              <p className="text-neutral-semi-dark">{user.displayName || " "}</p>
            </div>
          </div>
        </div>


        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="p-6 rounded-xl shadow-xl bg-primary-ultra-light 
                  transition-all duration-300 hover:shadow-xl hover:scale-105 ">
            <h2 className="text-sm font-bold text-primary mb-1">
              Full Name
            </h2>
            <p className="text-lg text-neutral-dark">
              {user.displayName || " "}
            </p>
          </div>

          <div className="p-6 rounded-xl shadow-xl bg-primary-ultra-light 
                  transition-all duration-300 hover:shadow-xl hover:scale-105 ">
            <h2 className="text-sm font-bold text-primary mb-1">
              Email
            </h2>
            <p className="text-lg text-neutral-dark">
              {user.email || " "}
            </p>
          </div>
        </div>


        <div className="bg-neutral-ultraLight p-6 flex justify-center">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-primary-dark hover:scale-105 text-white px-6 py-2 rounded-lg shadow-md transition"
          >
            <FaSignOutAlt className="text-lg" />
            <span>End Onborading</span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default Home;
