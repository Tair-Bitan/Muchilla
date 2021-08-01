import React, { ChangeEvent } from "react"

export type UseFormReturnVal<T1> = [T1, (ev: ChangeEvent<HTMLInputElement>) => void, React.Dispatch<React.SetStateAction<T1>>]
