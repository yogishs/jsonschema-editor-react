import * as React from "react";
import Form from '@arco-design/web-react/lib/Form';
import Input from '@arco-design/web-react/lib/Input';
import Checkbox from '@arco-design/web-react/lib/Checkbox';
import Select from '@arco-design/web-react/lib/Select';

import {useState, State} from "@hookstate/core";
import {JSONSchema7, JSONSchema7TypeName} from "../../JsonSchemaEditor.types";
import {getDefaultSchema, DataType, random, handleTypeChange} from "../utils";
import {Button, Collapse} from "@arco-design/web-react/lib";
import {IconPlusCircle} from "@arco-design/web-react/icon";
import Tooltip from "@arco-design/web-react/lib/Tooltip";

export interface SchemaArrayProps {
	schemaState: State<JSONSchema7>;
	onSchemaChange: (results: string) => void;
	isReadOnly: State<boolean>;
	children:  (false | JSX.Element)[];
}

export const SchemaRoot: React.FunctionComponent<SchemaArrayProps> = (
	props: React.PropsWithChildren<SchemaArrayProps>
) => {
	const state = useState(props.schemaState);
	const isReadOnlyState = useState(props.isReadOnly);
	const renderRootItem = () => {
		return (<div className="arco-form arco-form-inline">
			<Form.Item layout="inline">
				<Input disabled placeholder="root"/>
			</Form.Item>
			<Form.Item layout="inline">
				<Tooltip content="All Required">
					<Checkbox disabled={isReadOnlyState.value}/>
				</Tooltip>
			</Form.Item>
			<Form.Item layout="inline">
				<Select
					style={{width: '8rem'}}
					placeholder="Choose root data type"
					disabled={isReadOnlyState.value}
					value={state.type.value as string ?? ""}
					onChange={(value) => {
						const newSchema = handleTypeChange(
							value as JSONSchema7TypeName,
							false
						);
						state.set(newSchema as JSONSchema7);
					}}
				>
					<Select.Option key="object" value="object">
						object
					</Select.Option>
					<Select.Option key="array" value="array">
						array
					</Select.Option>
				</Select>
			</Form.Item>
			<Form.Item layout="inline">
				<Input placeholder="Add Title"
					   value={state.value?.title ?? ""}
					   disabled={isReadOnlyState.value}
					   onChange={(value, e) => {
						   state.title.set(value);
					   }}
				/>
			</Form.Item>
			<Form.Item layout="inline">
				<Input placeholder="Add Description"
					   value={state.value?.description ?? ""}
					   disabled={isReadOnlyState.value}
					   onChange={(value, evt: React.ChangeEvent<HTMLInputElement>) => {
						   state.description.set(value);
					   }}
				/>
			</Form.Item>
			{state.value?.type === "object" && (
				<Form.Item layout="inline">
					<Tooltip
						aria-label="Add Child Node"
						content="Add Child Node"
						position="top"
					>
						<Button
							disabled={isReadOnlyState.value}
							type="text"
							shape="circle"
							status="success"
							iconOnly
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
				</Form.Item>
			)}
		</div>);
	}

	return (
		<>
			<Collapse triggerRegion="icon" defaultActiveKey="root">
				<Collapse.Item name="root" header={renderRootItem()}>
					{props.children}
				</Collapse.Item>
			</Collapse>
		</>
	);
};
