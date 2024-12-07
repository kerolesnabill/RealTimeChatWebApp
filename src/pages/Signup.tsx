const Signup = () => {
  return (
    <div className="hero min-h-screen text-white">
      <div className="hero-content flex-col lg:flex-row-reverse gap-8">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Join the Chat World!</h1>
          <p className="py-6">
            Connect, communicate, and collaborate. Sign up now to be part of an
            amazing community!
          </p>
        </div>

        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 text-gray-800">
          <div className="card-body">
            <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
            <form>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control mt-6">
                <button className="btn btn-primary">Create Account</button>
              </div>

              <div className="divider">OR</div>
              <div className="form-control">
                <button className="btn btn-outline btn-accent">
                  <i className="fa fa-google mr-2"></i> Sign Up with Google
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
