import * as React from "react";
import { SchemaItem } from "../schema-item";
import {
	JSONSchema7,
	JSONSchema7Definition,
} from "../../JsonSchemaEditor.types";
import { useState, State } from "@hookstate/core";
import Modal from "@arco-design/web-react/lib/Modal"
import { AdvancedSettings } from "../schema-advanced";
export interface SchemaObjectProps {
	schemaState: State<JSONSchema7>;
	isReadOnly: State<boolean>;
}

export const SchemaObject: React.FunctionComponent<SchemaObjectProps> = (
	props: React.PropsWithChildren<SchemaObjectProps>
) => {
	const { schemaState, isReadOnly } = props;
	const schema = useState(schemaState);
	const properties = useState(schema.properties);

	const propertiesOrNull:
		| State<{
				[key: string]: JSONSchema7Definition;
		  }>
		| undefined = properties.ornull;

	const isReadOnlyState = useState(isReadOnly);

	const onCloseAdvanced = (): void => {
		localState.isAdvancedOpen.set(false);
	};

	const showadvanced = (item: string): void => {
		localState.isAdvancedOpen.set(true);
		localState.item.set(item);
	};

	const focusRef = React.createRef<HTMLElement>();

	const localState = useState({
		isAdvancedOpen: false,
		item: "",
	});

	if (!propertiesOrNull) {
		return <></>;
	} else {
		return (
			<div className="object-style">
				{propertiesOrNull?.keys?.map((name) => {
					return (
						<SchemaItem
							key={String(name)}
							itemStateProp={
								propertiesOrNull.nested(name as string) as State<JSONSchema7>
							}
							parentStateProp={schema}
							name={name as string}
							showadvanced={showadvanced}
							required={schema.required.value as string[]}
							isReadOnly={isReadOnlyState}
						/>
					);
				})}
				<Modal
					visible={localState.isAdvancedOpen.get()}
					onOk={onCloseAdvanced}
					okText="Close"
					hideCancel={true}
					title="Advanced Schema Settings">
							<AdvancedSettings
								itemStateProp={
									propertiesOrNull.nested(
										localState.item.value as string
									) as State<JSONSchema7>
								}
							/>
				</Modal>
			</div>
		);
	}
};
