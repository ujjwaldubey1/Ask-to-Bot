import { useContext, useState, useEffect, useRef } from "react"
import { mycontext } from "../ContextApi"
import { QuestionAns } from "./QuestionAns"

export const Button = () => {
	const { text, setText } = useContext(mycontext)
	const [inputText, setInputText] = useState("")
	const messagesEndRef = useRef(null)

	const handleKeyDown = (event) => {
		if (event.key === "Enter" && inputText.trim() !== "") {
			handleSend()
		}
	}

	const handleOnChange = (event) => {
		setInputText(event.target.value)
	}

	const handleSend = () => {
		if (inputText.trim() !== "") {
			setText((prevText) => [...prevText, inputText])
			setInputText("")
		}
	}

	// Scroll to the bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
	}, [text])

	return (
		<div className="flex flex-col h-screen p-5 bg-gray-50 rounded-lg shadow-lg">
			<div className="flex-1 overflow-auto">
				<div className="flex flex-col">
					{text.map((mesg, index) => (
						<div key={index}></div>
					))}
					{/* Render QuestionAns once below all messages */}
					<QuestionAns />
					<div ref={messagesEndRef} />
				</div>
			</div>
			<div className="flex items-center mt-4">
				<input
					className="w-full md:w-2/3 lg:w-1/2 p-3 rounded-lg shadow-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
					type="text"
					placeholder="You can talk to me"
					value={inputText}
					onChange={handleOnChange}
					onKeyDown={handleKeyDown}
				/>
				<button
					className="ml-2 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold shadow-lg hover:from-blue-600 hover:to-green-500 transition-all duration-300 ease-in-out"
					onClick={handleSend}>
					Send!
				</button>
			</div>
		</div>
	)
}
