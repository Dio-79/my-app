import { useState } from "react"



export function Home(){
  const [open, setOpen] = useState(false);
  const [selectHome,setselecthome]=useState("");


  const handleSelect = (value: string) => {
    setselecthome(value);
    setOpen(false);



}
}