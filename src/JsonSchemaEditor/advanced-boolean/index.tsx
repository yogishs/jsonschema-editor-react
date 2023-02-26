import * as React from "react";
import  Select from "@arco-design/web-react/lib/Select";
import  Form from "@arco-design/web-react/lib/Form";


import { AdvancedItemStateProps } from "../../JsonSchemaEditor.types";
import { useState } from "@hookstate/core";

export const AdvancedBoolean: React.FunctionComponent<AdvancedItemStateProps> = (
	props: React.PropsWithChildren<AdvancedItemStateProps>
) => {
	const { itemStateProp } = props;

	const item = useState(itemStateProp);

	return (
		<Form.Item layout ="inline">
			<Select

				value={(item.default.value as string) ?? ""}
					placeholder="Choose data type"
					onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
						item.default.set(evt.target.value);
					}}
				>
					<Select.Option key="true" value="true">
						true
					</Select.Option>
					<option key="false" value="false">
						false
					</option>
				</Select>
		</Form.Item>
	);
};
