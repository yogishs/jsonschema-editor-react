import * as React from "react"
import { render, RenderOptions } from "@testing-library/react"
import ConfigProvider from "@arco-design/web-react/lib/ConfigProvider"

const AllProviders = ({ children }: { children?: React.ReactNode }) => (
  <ConfigProvider >{children}</ConfigProvider>
)

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options })

export { customRender as render }
