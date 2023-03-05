import * as React from "react";
import Form from '@arco-design/web-react/lib/Form';
import Input from '@arco-design/web-react/lib/Input';
import Checkbox from '@arco-design/web-react/lib/Checkbox';
import Select from '@arco-design/web-react/lib/Select';
import Modal from '@arco-design/web-react/lib/Modal';
import {Button} from "@arco-design/web-react/lib";
import {IconPlusCircle, IconSettings} from "@arco-design/web-react/icon";
import Tooltip from "@arco-design/web-react/lib/Tooltip";

import {useState, State} from "@hookstate/core";
import {JSONSchema7, JSONSchema7TypeName} from "../../JsonSchemaEditor.types";
import {
	SchemaTypes,
	getDefaultSchema,
	DataType,
	handleTypeChange,
	random,
} from "../utils";

import {SchemaObject} from "../schema-object";
import {AdvancedSettings} from "../schema-advanced";

export interface SchemaArrayProps {
	schemaState: State<JSONSchema7>;
	isReadOnly: State<boolean>;
}

export const SchemaArray: React.FunctionComponent<SchemaArrayProps> = (
	props: React.PropsWithChildren<SchemaArrayProps>
) => {
	const {schemaState, isReadOnly} = props;

	const state = useState(schemaState.items as JSONSchema7);
	const isReadOnlyState = useState(isReadOnly);

	const {length} = state.path.filter((name) => name !== "properties");
	const tagPaddingLeftStyle = {
		paddingLeft: `${20 * (length + 1)}px`,
	};

	const onCloseAdvanced = (): void => {
		localState.isAdvancedOpen.set(false);
	};

	const showadvanced = (): void => {
		localState.isAdvancedOpen.set(true);
	};

	const focusRef = React.createRef<HTMLElement>();

	const localState = useState({
		isAdvancedOpen: false,
	});

	return (
		<div className="arco-form arco-form-inline">
			<Form.Item layout="inline">
				<Input
					key="Items"
					disabled
					value="Items"
				/>
			</Form.Item>
			<Form.Item layout="inline">
				<Checkbox disabled/>
			</Form.Item>
			<Form.Item layout="inline">
				<Select
					style={{width: '8rem'}}
					disabled={isReadOnlyState.value}
					value={state.type.value as JSONSchema7TypeName}
					placeholder="Choose data type"
					onChange={(value) => {
						const newSchema = handleTypeChange(
							value as JSONSchema7TypeName,
							false
						);
						state.set(newSchema as JSONSchema7);
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
			<Form.Item layout="inline">
				<Input
					value={state.title.value}
					disabled={isReadOnlyState.value}
					placeholder="Add Title"
					onChange={(value) => {
						state.title.set(value);
					}}
				/>
			</Form.Item>
			<Form.Item layout="inline">
				<Input
					value={state.description.value}
					disabled={isReadOnlyState.value}
					placeholder="Add Description"
					onChange={(value) => {
						state.description.set(value);
					}}
				/>
			</Form.Item>
			<Form.Item layout="inline">
				<Tooltip
					aria-label="Advanced Settings"
					content="Advanced Settings"
					position="top"
				>
					<Button
						type="text"
						shape="round"
						status="default"
						disabled={isReadOnlyState.value}
						icon={<IconSettings style={{fontSize: '1rem'}}/>}
						aria-label="Advanced Settings"
						onClick={() => {
							showadvanced();
						}}
					/>
				</Tooltip>
				{state.type.value === "object" && (
					<Tooltip
						aria-label="Add Child Node"
						content="Add Child Node"
						position="top"
					>
						<Button
							shape="round"
							disabled={isReadOnlyState.value}
							status="success"
							icon={<IconPlusCircle style={{fontSize: '1rem'}}/>}
							aria-label="Add Child Node"
							onClick={() => {
								const fieldName = `field_${random()}`;
								(state.properties as State<{
									[key: string]: JSONSchema7;
								}>)[fieldName].set(getDefaultSchema(DataType.string));
							}}
						/>
					</Tooltip>
				)}
			</Form.Item>
			{
				state.type?.value === "object" && (
					<SchemaObject isReadOnly={isReadOnlyState} schemaState={state}/>
				)
			}
			{
				state.type?.value === "array" && (
					<SchemaArray isReadOnly={isReadOnlyState} schemaState={state}/>
				)
			}
			<Modal hideCancel
				   okText="Close"
				   visible={localState.isAdvancedOpen.get()}
				   onOk={onCloseAdvanced}
				   onCancel={onCloseAdvanced}
				   title="Advanced Schema Settings">
				<AdvancedSettings itemStateProp={state}/>
			</Modal>
		</div>
	);
};
