import * as React from "react";
import Button from "@arco-design/web-react/lib/Button"
import Popover from "@arco-design/web-react/lib/Popover"
import { DataType, getDefaultSchema } from "../utils";
import { State, useState } from "@hookstate/core";
import {
	JSONSchema7,
	JSONSchema7Definition,
} from "../../JsonSchemaEditor.types";
import { random } from "../utils";
import {IconPlusCircle} from "@arco-design/web-react/icon";
import { Form } from "@arco-design/web-react/lib";
export interface DropPlusProps {
	itemStateProp: State<JSONSchema7>;
	parentStateProp: State<JSONSchema7>;
	isDisabled: boolean;
}
export const DropPlus: React.FunctionComponent<DropPlusProps> = (
	props: React.PropsWithChildren<DropPlusProps>
) => {
	const itemState = useState(props.itemStateProp);
	const parentState = useState(props.parentStateProp);
	const parentStateOrNull: State<JSONSchema7> | undefined = parentState.ornull;
	const propertiesOrNull:
		| State<{
				[key: string]: JSONSchema7Definition;
		  }>
		| undefined = parentStateOrNull.properties.ornull;

	const itemPropertiesOrNull:
		| State<{
				[key: string]: JSONSchema7Definition;
		  }>
		| undefined = itemState.properties.ornull;

	if (props.isDisabled) {
		return <div />;
	}

	if (!parentStateOrNull) {
		return <></>;
	}

	return (
		<Popover trigger="hover"
		content={<Form.Item layout="inline">
			<Button
				status="default"
				type="text"
				onClick={() => {
					const fieldName = `field_${random()}`;
					propertiesOrNull
						?.nested(fieldName)
						.set(getDefaultSchema(DataType.string) as JSONSchema7);
				}}
			>
				Sibling Node
			</Button>
			<Button
				status="warning"
				type="text"
				onClick={() => {
					if (itemState.properties) {
						const fieldName = `field_${random()}`;
						itemPropertiesOrNull
							?.nested(fieldName)
							.set(getDefaultSchema(DataType.string) as JSONSchema7);
					}
				}}
			>
				Child Node
			</Button>
		</Form.Item>}>
				<Button
					type="text"
					shape="round"
					status="success"
					icon={<IconPlusCircle style={{fontSize:'1rem'}} />}
					aria-label="Add Child Node"
				/>
		</Popover>
	);
};
