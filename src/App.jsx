import { mycontext } from "./ContextApi"
import { Button } from "./component/Button"

import { useState } from "react"

export default function App() {
	const [text, setText] = useState([])
	return (
		<>
			<mycontext.Provider value={{ text, setText }}>
				<Button></Button>
			</mycontext.Provider>
		</>
	)
}
