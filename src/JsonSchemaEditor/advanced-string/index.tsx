import * as React from "react";
import Form from '@arco-design/web-react/lib/Form';
import Input from '@arco-design/web-react/lib/Input';
import InputNumber from '@arco-design/web-react/lib/InputNumber';
import Checkbox from '@arco-design/web-react/lib/Checkbox';
import Select from '@arco-design/web-react/lib/Select';
import TextArea from '@arco-design/web-react/lib/Input/textarea';


import {
	AdvancedItemStateProps,
	JSONSchema7,
} from "../../JsonSchemaEditor.types";
import {none, useState} from "@hookstate/core";
import {StringFormat} from "../utils";
import {Space} from "@arco-design/web-react";

export const AdvancedString: React.FunctionComponent<AdvancedItemStateProps> = (
	props: React.PropsWithChildren<AdvancedItemStateProps>
) => {
	const {itemStateProp} = props;

	const changeEnumOtherValue = (value: string): string[] | null => {
		const array = value.split("\n");
		if (array.length === 0 || (array.length === 1 && !array[0])) {
			return null;
		}

		return array;
	};

	const itemState = useState(itemStateProp);

	const isEnumChecked = (itemState.value as JSONSchema7).enum !== undefined;
	const enumData = (itemState.value as JSONSchema7).enum
		? (itemState.enum.value as string[])
		: [];
	const enumValue = enumData?.join("\n");

	return (
		<div className="arco-form arco-form-vertical">
			<Form.Item layout="vertical" label="Default" colon={true}>
				<Input
					id="default"
					placeholder="Default value"
					value={(itemState.default.value as string) ?? ""}
					onChange={(value) => {
						itemState.default.set(value);
					}}
				/>
			</Form.Item>
			<div className="arco-form arco-form-inline">
				<Space size="small">
					<Form.Item layout="vertical" label="Min Length" colon={true}>
						<InputNumber
							defaultValue={Number(itemState.minLength.value)}
							onChange={(value: number | string) => {
								itemState.minLength.set(Number(value));
							}}
							value={Number(itemState.minLength.value)}
						/>
					</Form.Item>

					<Form.Item layout="vertical" label="Max Length" colon={true}>
						<InputNumber
							defaultValue={Number(itemState.maxLength.value)}
							onChange={(value: number | string) => {
								itemState.maxLength.set(Number(value));
							}}
							value={Number(itemState.maxLength.value)}
						/>
					</Form.Item>
				</Space>
			</div>
			<Form.Item layout="vertical" label="Pattern" colon={true}>
				<Input
					id="pattern"
					placeholder="MUST be a valid regular expression."
					value={itemState.pattern.value ?? ""}
					onChange={(value) => {
						itemState.pattern.set(value);
					}}
				/>
			</Form.Item>
			<div className="arco-form arco-form-inline">
				<Space size="small">
					<Form.Item layout="vertical" label="Enum" colon={true}>
						<Checkbox
							checked={isEnumChecked}
							onChange={(value) => {
								if (!value) {
									itemState.enum.set(none);
								} else {
									itemState.enum.set(Array<string>());
								}
							}}
						/>
					</Form.Item>
					<Form.Item layout="vertical">
						<TextArea
							value={enumValue || ""}
							disabled={!isEnumChecked}
							placeholder="ENUM Values - One Entry Per Line"
							onChange={(value) => {
								const update = changeEnumOtherValue(value);
								if (update === null) {
									itemState.enum.set(none);
								} else {
									itemState.enum.set(update as string[]);
								}
							}}
						/>
					</Form.Item>
				</Space>
			</div>
			<Form.Item layout="vertical" label="Format" colon={true}>
				<Select

					value={itemState.format.value ?? ""}
					placeholder="Choose data type"
					onChange={(value) => {
						if (value === "") {
							itemState.format.set(none);
						} else {
							itemState.format.set(value);
						}
					}}
				>
					{StringFormat.map((item, index) => {
						return (
							<Select.Option key={String(index)} value={item.name}>
								{item.name}
							</Select.Option>
						);
					})}
				</Select>
			</Form.Item>
		</div>
	);
};
