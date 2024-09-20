import { useContext, useState, useEffect } from "react"
import { mycontext } from "../ContextApi"

export const QuestionAns = () => {
	const { text } = useContext(mycontext)
	const [questions, setQuestions] = useState([])
	const [responses, setResponses] = useState({})

	useEffect(() => {
		const newQuestions = text.filter((msg) => !questions.includes(msg))
		if (newQuestions.length > 0) {
			setQuestions((prevQuestions) => [...prevQuestions, ...newQuestions])
			newQuestions.forEach((question) => fetchResponse(question))
		}
	}, [text])

	const fetchResponse = async (question) => {
		try {
			const res = await fetch(
				"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyB3N1fjbVYOjBE99iSSyKuzrTb7OKr5VKE",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						contents: [
							{
								parts: [{ text: question }],
							},
						],
					}),
				}
			)

			if (!res.ok) throw new Error("Response not ok")

			const data = await res.json()
			const answer =
				data?.candidates?.[0]?.content?.parts?.[0]?.text ||
				"No answer available"

			setResponses((prevResponses) => ({
				...prevResponses,
				[question]: answer,
			}))
		} catch (error) {
			console.error("Error fetching response:", error)
			setResponses((prevResponses) => ({
				...prevResponses,
				[question]: "Error fetching response, please try again.",
			}))
		}
	}

	return (
		<div className="bg-gray-200 p-5 rounded-lg shadow-md mt-5 transition-transform transform hover:scale-105">
			<p className="text-gray-700 font-semibold">Conversation:</p>
			<div className="space-y-4">
				{questions.map((question, index) => (
					<div
						key={index}
						className="bg-white shadow-neumorphic p-4 rounded-lg mb-2 transition-shadow hover:shadow-lg">
						<p>
							<strong className="text-blue-600">Q:</strong> {question}
						</p>
						<p>
							<strong className="text-green-600">A:</strong>{" "}
							{responses[question] || "Waiting for response..."}
						</p>
					</div>
				))}
			</div>
		</div>
	)
}
