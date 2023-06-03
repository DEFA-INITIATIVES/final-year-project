import React, { useContext, useState,useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useLogin } from "../../api/hooks/useAuth";
import Web3 from 'web3';


import { AuthContext } from "../../contexts/AuthContext";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../../redux/authSlice";

export default function Login() {
	const dispatch = useDispatch();
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
			dispatch(setUser(response));
			dispatch(setToken(response.token));
			// console.log(response.token);
			console.log(response.token, response.role);
			// if (response.role) localStorage.setItem("role", response.role);

			localStorage.setItem("role", response.role);

			if (response.token && response.role === "police") {
				localStorage.setItem("userToken", response.token);
				setIsAuthenticated(true);
				navigate("/");
			} else if (response.token && response.role === "forensic" ||  response.role === "forensics") {
				localStorage.setItem("userToken", response.token);
				setIsAuthenticated(true);
				navigate("/forensic");
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		window.onload = async () => {
		  if (window.ethereum) {
			// MetaMask is installed
			try {
			  // Request account access
			  await window.ethereum.enable();
			  
			  // Initialize Web3
			  const web3 = new Web3(window.ethereum);
			  
			  // You can now use web3 object to interact with MetaMask
			  // For example:
			  const accounts = await web3.eth.getAccounts();
			  console.log(accounts); // Display the connected account(s)
			} catch (error) {
			  console.error(error);
			}
		  } else {
			// MetaMask is not installed
			console.log('Please install MetaMask extension.');
		  }
		};
	  }, []);
	  

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
					<button
						onClick={() => navigate("/signup")}
						className="w-full  mt-8 py-4 bg-slate-600 rounded-md hover:bg-indigo-500 relative text-white"
					>
						Don't an account signup
					</button>
				</form>
			</div>
		</div>
	);
}
