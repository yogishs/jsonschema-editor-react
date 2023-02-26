import * as React from "react";
import Form from '@arco-design/web-react/lib/Form';
import Input from '@arco-design/web-react/lib/Input';
import Checkbox from '@arco-design/web-react/lib/Checkbox';
import Select from '@arco-design/web-react/lib/Select';
import Notification from '@arco-design/web-react/lib/Notification';
import {Button} from "@arco-design/web-react/lib";
import {IconDelete, IconPlusCircle, IconSettings} from "@arco-design/web-react/icon";
import Tooltip from "@arco-design/web-react/lib/Tooltip";
import {DropPlus} from "../drop-plus";
import {useState, State, none} from "@hookstate/core";
import {
	JSONSchema7,
	JSONSchema7Definition,
	JSONSchema7TypeName,
} from "../../JsonSchemaEditor.types";
import {
	getDefaultSchema,
	DataType,
	SchemaTypes,
	random,
	handleTypeChange,
} from "../utils";
import {renameKeys, deleteKey} from "../utils";
import {useDebouncedCallback} from "use-debounce";
import {SchemaObject} from "../schema-object";
import {SchemaArray} from "../schema-array";

export interface SchemaItemProps {
	required: string[];
	itemStateProp: State<JSONSchema7>;
	parentStateProp: State<JSONSchema7>;
	name: string;
	isReadOnly: State<boolean>;
	showadvanced: (item: string) => void;
}

export const SchemaItem: React.FunctionComponent<SchemaItemProps> = (
	props: React.PropsWithChildren<SchemaItemProps>
) => {
	const {
		name,
		itemStateProp,
		showadvanced,
		required,
		parentStateProp,
		isReadOnly,
	} = props;

	// const itemState = useState(itemStateProp);
	const parentState = useState(parentStateProp);
	const parentStateOrNull: State<JSONSchema7> | undefined = parentState.ornull;
	const propertiesOrNull:
		| State<{
		[key: string]: JSONSchema7Definition;
	}>
		| undefined = parentStateOrNull.properties.ornull;

	const nameState = useState(name);
	const isReadOnlyState = useState(isReadOnly);

	const itemState = useState(
		(parentStateProp.properties as State<{
			[key: string]: JSONSchema7;
		}>).nested(nameState.value)
	);

	const {length} = parentState.path.filter((name) => name !== "properties");
	const tagPaddingLeftStyle = {
		paddingLeft: `${20 * (length + 1)}px`,
	};

	const isRequired = required
		? required.length > 0 && required.includes(name)
		: false;

	// Debounce callback
	const debounced = useDebouncedCallback(
		// function
		(newValue: string) => {
			// Todo: make toast for duplicate properties
			if (propertiesOrNull && propertiesOrNull[newValue].value) {
				Notification.error({
					title: "Duplicate Property",
					content: "Property already exists!",
					duration: 1000,
					closable: true,

				});
			} else {
				const oldName = name;
				const proptoupdate = newValue;

				const newobj = renameKeys(
					{[oldName]: proptoupdate},
					parentState.properties.value
				);
				parentStateOrNull.properties.set(JSON.parse(JSON.stringify(newobj)));
			}
		},
		// delay in ms
		1000
	);

	if (!itemState.value) {
		return <></>;
	}

	return (
		<div className="arco-form arco-form-inline" style={tagPaddingLeftStyle}>
			<Form.Item layout={"inline"}>
				<Input
					disabled={isReadOnlyState.value}
					defaultValue={nameState.value}
					placeholder="Enter property name"
					onChange={(value) => {
						debounced(value);
					}}
				/>
			</Form.Item>
			<Form.Item layout={"inline"}>
				<Checkbox
					disabled={isReadOnlyState.value}
					checked={isRequired}
					onChange={(value) => {
						if (!value && required.includes(name)) {
							(parentState.required as State<string[]>)[
								required.indexOf(name)
								].set(none);
						} else {
							parentState.required.merge([name]);
						}
					}}
				/>
			</Form.Item>
			<Form.Item layout={"inline"}>
				<Select
					style={{width: '8rem'}}
					disabled={false}
					value={itemState.type.value as string}
					placeholder="Choose data type"
					onChange={(value) => {
						const newSchema = handleTypeChange(
							value as JSONSchema7TypeName,
							false
						);
						itemState.set(newSchema as JSONSchema7);
					}}
				>
					{SchemaTypes.map((item, index) => {
						return (
							<Select.Option key={String(index)} value={item}>
								{item}
							</Select.Option>
						);
					})}
				</Select>
			</Form.Item>
			<Form.Item layout={"inline"}>
				<Input
					disabled={isReadOnlyState.value}
					value={itemState.title.value || ""}
					placeholder="Add Title"
					onChange={(value) => {
						itemState.title.set(value);
					}}
				/>
			</Form.Item>
			<Form.Item layout={"inline"}>
				<Input
					disabled={isReadOnlyState.value}
					value={itemState.description.value || ""}
					placeholder="Add Description"
					onChange={(value) => {
						itemState.description.set(value);
					}}
				/>
			</Form.Item>
			<Form.Item layout={"inline"}>
				{itemState.type.value !== "object" && itemState.type.value !== "array" && (

					<Tooltip
						aria-label="Advanced Settings"
						content="Advanced Settings"
						position="top"
					>
						<Button
							shape="round"
							type="text"
							disabled={isReadOnlyState.value}
							status="default"
							icon={<IconSettings style={{fontSize: '1rem'}}/>}
							aria-label="Advanced Settings"
							onClick={() => {
								showadvanced(name);
							}}
						/>
					</Tooltip>
				)}
				<Tooltip
					aria-label="Remove Node"
					content="Remove Node"
					position="top"
				>
					<Button
						shape="round"
						type="text"
						disabled={isReadOnlyState.value}
						status="danger"
						icon={<IconDelete style={{fontSize: '1rem'}}/>}
						aria-label="Remove Node"
						onClick={() => {
							const updatedState = deleteKey(
								nameState.value,
								JSON.parse(JSON.stringify(parentState.properties.value))
							);
							parentState.properties.set(updatedState);
						}}
					/>
				</Tooltip>

				{itemState.type?.value === "object" ? (
					<DropPlus
						isDisabled={isReadOnlyState.value}
						parentStateProp={parentState}
						itemStateProp={itemStateProp}
					/>
				) : (
					<Tooltip
						aria-label="Add Sibling Node"
						content="Add Sibling Node"
						position="top"
					>
						<Button
							shape="round"
							type="text"
							disabled={isReadOnlyState.value}
							status="success"
							icon={<IconPlusCircle style={{fontSize: '1rem'}}/>}
							aria-label="Add Sibling Node"
							onClick={() => {
								if (propertiesOrNull) {
									const fieldName = `field_${random()}`;
									propertiesOrNull
										?.nested(fieldName)
										.set(getDefaultSchema(DataType.string) as JSONSchema7);
								}
							}}
						/>
					</Tooltip>
				)}
			</Form.Item>
			{itemState.type?.value === "object" && (
				<SchemaObject isReadOnly={isReadOnlyState} schemaState={itemState}/>
			)}
			{itemState.type?.value === "array" && (
				<SchemaArray isReadOnly={isReadOnlyState} schemaState={itemState}/>
			)}
		</div>
	);
};
