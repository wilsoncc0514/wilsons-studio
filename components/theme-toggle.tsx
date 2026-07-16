"use client";
import { useEffect,useState } from "react";
export function ThemeToggle(){const [dark,setDark]=useState(false);useEffect(()=>{const d=localStorage.theme==="dark";setDark(d);document.documentElement.classList.toggle("dark",d)},[]);return <button className="iconbtn" aria-label="Toggle color theme" onClick={()=>{const n=!dark;setDark(n);document.documentElement.classList.toggle("dark",n);localStorage.theme=n?"dark":"light"}}>{dark?"☀":"◐"}</button>}
