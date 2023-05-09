import React, { useContext, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../../api/hooks/useAuth";

import { AuthContext } from "../../contexts/AuthContext";

export default function Login() {
	const [clicked, setClicked] = useState({ police: true, forensic: false });
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { setIsAuthenticated } = useContext(AuthContext);

	const loginMutation = useLogin();

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevState) => ({ ...prevState, [name]: value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setLoading(true);
		try {
			const response = await loginMutation.mutateAsync(formData);
			if (response.token) setIsAuthenticated(true);
			navigate("home");
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative w-full h-screen sm:bg-zinc-900/90  bg-gray-400   ">
			<img
				className="absolute w-full h-full object-cover mix-blend-overlay hidden  md:block"
				src="https://res.cloudinary.com/itgenius/image/upload/v1683377164/matt-popovich-7mqsZsE6FaU-unsplash_c7ywzi.jpg"
				alt="/"
			/>
			<div className="flex justify-center items-center h-full">
				<form className="max-w-[400px] w-full mx-auto bg-white rounded-[24px] p-8">
					<h2 className="text-4xl font-bold text-center py-4 font-sans text-gray-700">
						LOGIN
					</h2>
					<div className="flex justify-between py-8">
						<p
							className={`border  px-6 py-2 relative flex items-center rounded-md cursor-pointer hover:bg-gray-400 ${
								clicked.police ? "bg-gray-300" : "bg-none"
							}`}
							onClick={() => {
								setClicked({
									police: clicked.police
										? clicked.police
										: !clicked.police,
									forensic: clicked.forensic
										? !clicked.forensic
										: clicked.forensic,
								});
							}}
						>
							{" "}
							Police{" "}
						</p>
						<p
							className={`border cursor-pointer px-6 py-2 relative flex items-center rounded-md hover:bg-gray-300 ${
								clicked.forensic ? "bg-gray-300" : "bg-none"
							}`}
							onClick={() => {
								setClicked({
									police: !clicked.police,
									forensic: !clicked.forensic,
								});
							}}
						>
							Forensics
						</p>
					</div>
					<div className="flex flex-col mb-4">
						<label className="text-gray-900 font-sans font-bold">
							Email
						</label>
						<input
							className="border relative bg-gray-100 p-2 rounded-md "
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="flex flex-col ">
						<label className="text-gray-900 font-sans font-bold">
							Password
						</label>
						<input
							className="border relative bg-gray-100 p-2 rounded-md"
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
						/>
					</div>
					<button
						onClick={handleSubmit}
						className="w-full py-3 mt-8 bg-indigo-600 rounded-md hover:bg-indigo-500 relative text-white"
					>
						{loading ? (
							<div className="text-white text-center  font-bold">
								Authenticating.....
							</div>
						) : (
							"Sign In"
						)}
					</button>
					<p className="flex items-center mt-2 font-semibold font-sans">
						<input className="mr-2" type="checkbox" />
						Remember Me
					</p>
					<p className="text-center mt-8 text-gray-700 font-sans cursor-pointer font-bold">
						Not a member?{" "}
						<Link to="/signup" className="cursor-pointer text-blue-700">
							Sign up now
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
