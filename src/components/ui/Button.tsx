import { Button as AntButton, type ButtonProps as AntButtonProps } from 'antd'

/*
 * Phase 0 stub: thin pass-through so app code never imports from "antd".
 * Phase 2 replaces this with the Primary / Secondary variants and Motion press.
 */
export type ButtonProps = AntButtonProps

export function Button(props: ButtonProps) {
  return <AntButton {...props} />
}
