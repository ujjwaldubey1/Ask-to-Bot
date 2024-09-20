import { useContext, useState, useEffect } from "react"
import { mycontext } from "../ContextApi"

export const QuestionAns = () => {
	const { text } = useContext(mycontext)
	const [questions, setQuestions] = useState([]) 
	const [responses, setResponses] = useState({})
	const [processedQuestions, setProcessedQuestions] = useState(new Set()) 
	
	useEffect(() => {
		if (text.length > 0) {
			const newQuestion = text[text.length - 1] 

			if (!processedQuestions.has(newQuestion)) {
			
				setQuestions((prevQuestions) => [...prevQuestions, newQuestion])
				
				setProcessedQuestions((prev) => {
					const newSet = new Set(prev)
					newSet.add(newQuestion)
					return newSet
				})
				
				fetchResponse(newQuestion)
			}
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
								parts: [
									{
										text: question,
									},
								],
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
		<div className="bg-yellow-100 p-5 rounded-lg shadow-lg mt-5">
			<p className="text-gray-700 font-semibold">Responses:</p>
			<div>
				{questions.map((question, index) => (
					<div key={index} className="mb-2">
						<p>
							<strong>Q:</strong> {question}
						</p>
						<p>
							<strong>A:</strong>{" "}
							{responses[question] || "Waiting for response..."}
						</p>
					</div>
				))}
			</div>
		</div>
	)
}
